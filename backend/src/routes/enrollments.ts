import express from 'express';
import { Response } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import { UserRole } from '../models/User';

const router = express.Router();

// Enroll in a course
router.post('/courses/:courseId', authenticate, async (req: AuthRequest, res: Response) => {
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
      progress: [],
      overallProgress: 0,
      isCompleted: false,
    });
    
    await enrollment.save();
    
    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get my enrollments
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: 'course',
        select: 'title description thumbnail instructor published',
        populate: {
          path: 'instructor',
          select: 'firstName lastName email profilePicture',
        },
      });
    
    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get enrollment for a specific course
router.get('/courses/:courseId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { courseId } = req.params;
    
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
    
    res.json(enrollment);
  } catch (error) {
    console.error('Error fetching enrollment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update lesson completion status
router.put('/courses/:courseId/lessons/:lessonId', authenticate, async (req: AuthRequest, res: Response) => {
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
    
    // Calculate progress (simplified)
    // In a real app, you would need to get the total number of lessons from the course
    enrollment.overallProgress = 0; // This should be calculated based on completed lessons
    
    await enrollment.save();
    
    res.json(enrollment);
  } catch (error) {
    console.error('Error updating lesson completion:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course students (for instructors)
router.get('/courses/:courseId/students', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), async (req: AuthRequest, res: Response) => {
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
    
    // Verify user is the instructor or an admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: 'Not authorized to view course students' });
    }
    
    const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'firstName lastName email profilePicture');
    
    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching course students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 