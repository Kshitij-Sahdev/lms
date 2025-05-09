import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Enrollment, { IEnrollment } from '../models/Enrollment';
import Course from '../models/Course';
import User, { UserRole } from '../models/User';
import Notification, { NotificationType } from '../models/Notification';

/**
 * Enroll a student in a course
 */
export const enrollInCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { courseId } = req.params;
    
    // Verify course exists
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Verify course is published
    if (!course.published) {
      return res.status(400).json({ message: 'Cannot enroll in unpublished course' });
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    // Create enrollment
    const enrollment = new Enrollment({
      student: req.user.id,
      course: courseId,
      completedLessons: [],
      overallProgress: 0,
      isCompleted: false,
    });
    
    await enrollment.save();
    
    // Create notification for instructor
    const notification = new Notification({
      user: course.instructor,
      title: 'New Enrollment',
      message: `A new student has enrolled in your course: ${course.title}`,
      type: NotificationType.COURSE,
      resourceId: courseId,
      link: `/teacher/courses/${courseId}/students`,
    });
    
    await notification.save();
    
    return res.status(201).json(enrollment);
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all enrollments for a student
 */
export const getMyEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { limit = 20, page = 1 } = req.query;
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Find enrollments
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: 'course',
        select: 'title description thumbnail instructor published',
        populate: {
          path: 'instructor',
          select: 'firstName lastName email profilePicture',
        },
      })
      .sort({ enrolledAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Count total enrollments for pagination
    const totalEnrollments = await Enrollment.countDocuments({ student: req.user.id });
    
    return res.status(200).json({
      enrollments,
      totalPages: Math.ceil(totalEnrollments / Number(limit)),
      currentPage: Number(page),
      totalEnrollments,
    });
  } catch (error) {
    console.error('Error getting enrollments:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a single enrollment
 */
export const getEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { courseId } = req.params;
    
    // Find enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    }).populate({
      path: 'course',
      populate: {
        path: 'instructor',
        select: 'firstName lastName email profilePicture',
      },
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Update last accessed
    enrollment.lastAccessed = new Date();
    await enrollment.save();
    
    return res.status(200).json(enrollment);
  } catch (error) {
    console.error('Error getting enrollment:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update lesson completion status
 */
export const updateLessonCompletion = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { courseId, lessonId } = req.params;
    const { completed } = req.body;
    
    if (completed === undefined) {
      return res.status(400).json({ message: 'Completed status is required' });
    }
    
    // Find enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Update lesson completion
    if (completed && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    } else if (!completed && enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons = enrollment.completedLessons.filter(id => id !== lessonId);
    }
    
    // Get course to calculate progress
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Calculate total lessons
    let totalLessons = 0;
    course.modules.forEach(module => {
      totalLessons += module.lessons.length;
    });
    
    // Update progress
    if (totalLessons > 0) {
      enrollment.overallProgress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
      
      // Check if course is completed
      if (enrollment.overallProgress === 100 && !enrollment.isCompleted) {
        enrollment.isCompleted = true;
        
        // Create notification for completion
        const notification = new Notification({
          user: req.user.id,
          title: 'Course Completed',
          message: `Congratulations! You have completed the course: ${course.title}`,
          type: NotificationType.COURSE,
          resourceId: courseId,
        });
        
        await notification.save();
      }
    }
    
    await enrollment.save();
    
    return res.status(200).json(enrollment);
  } catch (error) {
    console.error('Error updating lesson completion:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get course students (for instructors)
 */
export const getCourseStudents = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { courseId } = req.params;
    const { limit = 50, page = 1 } = req.query;
    
    // Verify course exists
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor or an admin
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view course students' });
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Find enrollments
    const enrollments = await Enrollment.find({ course: courseId })
      .populate('student', 'firstName lastName email profilePicture')
      .sort({ enrolledAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Count total enrollments for pagination
    const totalEnrollments = await Enrollment.countDocuments({ course: courseId });
    
    return res.status(200).json({
      students: enrollments,
      totalPages: Math.ceil(totalEnrollments / Number(limit)),
      currentPage: Number(page),
      totalEnrollments,
    });
  } catch (error) {
    console.error('Error getting course students:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Unenroll from a course
 */
export const unenrollFromCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { courseId } = req.params;
    
    // Find enrollment
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: courseId,
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    
    // Delete enrollment
    await Enrollment.findByIdAndDelete(enrollment._id);
    
    return res.status(200).json({ message: 'Successfully unenrolled from course' });
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  enrollInCourse,
  getMyEnrollments,
  getEnrollment,
  updateLessonCompletion,
  getCourseStudents,
  unenrollFromCourse,
}; 