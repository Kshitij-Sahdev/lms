import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import LiveClass, { LiveClassStatus, ILiveClass } from '../models/LiveClass';
import Course from '../models/Course';
import User, { UserRole } from '../models/User';
import Enrollment from '../models/Enrollment';
import Notification, { NotificationType } from '../models/Notification';

/**
 * Create a live class
 */
export const createLiveClass = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const {
      title,
      description,
      courseId,
      startTime,
      endTime,
      platform,
      meetingUrl,
      meetingId,
      passcode,
    } = req.body;
    
    // Validate required fields
    if (!title || !description || !courseId || !startTime || !endTime || !meetingUrl) {
      return res.status(400).json({
        message: 'Title, description, courseId, startTime, endTime, and meetingUrl are required',
      });
    }
    
    // Find course
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Verify user is the instructor or an admin
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to create live classes for this course' });
    }
    
    // Create live class
    const liveClass = new LiveClass({
      title,
      description,
      course: courseId,
      instructor: req.user.id,
      startTime,
      endTime,
      platform,
      meetingUrl,
      meetingId,
      passcode,
      status: LiveClassStatus.SCHEDULED,
      attendees: [],
    });
    
    await liveClass.save();
    
    // Notify enrolled students
    const enrollments = await Enrollment.find({ course: courseId })
      .select('student');
    
    const studentIds = enrollments.map(enrollment => enrollment.student);
    
    // Create notifications
    const notifications = studentIds.map(studentId => ({
      user: studentId,
      title: 'New Live Class Scheduled',
      message: `A new live class "${title}" has been scheduled for ${new Date(startTime).toLocaleString()}`,
      type: NotificationType.LIVE_CLASS,
      resourceId: liveClass._id.toString(),
      link: `/courses/${courseId}/live-classes/${liveClass._id}`,
    }));
    
    await Notification.insertMany(notifications);
    
    return res.status(201).json(liveClass);
  } catch (error) {
    console.error('Error creating live class:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get all live classes for a course
 */
export const getCourseLiveClasses = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const { status } = req.query;
    
    // Build query
    const query: any = { course: courseId };
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Find live classes
    const liveClasses = await LiveClass.find(query)
      .populate('instructor', 'firstName lastName email profilePicture')
      .sort({ startTime: 1 });
    
    return res.status(200).json(liveClasses);
  } catch (error) {
    console.error('Error getting live classes:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a single live class
 */
export const getLiveClass = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find live class
    const liveClass = await LiveClass.findById(id)
      .populate('instructor', 'firstName lastName email profilePicture');
    
    if (!liveClass) {
      return res.status(404).json({ message: 'Live class not found' });
    }
    
    return res.status(200).json(liveClass);
  } catch (error) {
    console.error('Error getting live class:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update a live class
 */
export const updateLiveClass = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    const {
      title,
      description,
      startTime,
      endTime,
      platform,
      meetingUrl,
      meetingId,
      passcode,
      status,
      recordingUrl,
    } = req.body;
    
    // Find live class
    const liveClass = await LiveClass.findById(id);
    
    if (!liveClass) {
      return res.status(404).json({ message: 'Live class not found' });
    }
    
    // Find course
    const course = await Course.findById(liveClass.course);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Verify user is the instructor or an admin
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this live class' });
    }
    
    // Check if there are any changes to notify students about
    const hasTimeChanged = (startTime && new Date(startTime).getTime() !== new Date(liveClass.startTime).getTime()) ||
      (endTime && new Date(endTime).getTime() !== new Date(liveClass.endTime).getTime());
    
    const hasMeetingUrlChanged = meetingUrl && meetingUrl !== liveClass.meetingUrl;
    
    // Update live class
    if (title) liveClass.title = title;
    if (description) liveClass.description = description;
    if (startTime) liveClass.startTime = new Date(startTime);
    if (endTime) liveClass.endTime = new Date(endTime);
    if (platform) liveClass.platform = platform;
    if (meetingUrl) liveClass.meetingUrl = meetingUrl;
    if (meetingId) liveClass.meetingId = meetingId;
    if (passcode) liveClass.passcode = passcode;
    if (status) liveClass.status = status;
    if (recordingUrl) liveClass.recordingUrl = recordingUrl;
    
    await liveClass.save();
    
    // Notify enrolled students if important details changed
    if (hasTimeChanged || hasMeetingUrlChanged) {
      const enrollments = await Enrollment.find({ course: liveClass.course })
        .select('student');
      
      const studentIds = enrollments.map(enrollment => enrollment.student);
      
      // Create notifications
      const notifications = studentIds.map(studentId => ({
        user: studentId,
        title: 'Live Class Updated',
        message: `The live class "${liveClass.title}" has been updated. Please check the new details.`,
        type: NotificationType.LIVE_CLASS,
        resourceId: liveClass._id.toString(),
        link: `/courses/${liveClass.course}/live-classes/${liveClass._id}`,
      }));
      
      await Notification.insertMany(notifications);
    }
    
    // If status changed to LIVE, send notifications
    if (status === LiveClassStatus.LIVE && liveClass.status !== LiveClassStatus.LIVE) {
      const enrollments = await Enrollment.find({ course: liveClass.course })
        .select('student');
      
      const studentIds = enrollments.map(enrollment => enrollment.student);
      
      // Create notifications
      const notifications = studentIds.map(studentId => ({
        user: studentId,
        title: 'Live Class Started',
        message: `The live class "${liveClass.title}" has started. Join now!`,
        type: NotificationType.LIVE_CLASS,
        resourceId: liveClass._id.toString(),
        link: `/courses/${liveClass.course}/live-classes/${liveClass._id}`,
      }));
      
      await Notification.insertMany(notifications);
    }
    
    // If status changed to COMPLETED and recording was added
    if (status === LiveClassStatus.COMPLETED && recordingUrl && liveClass.status !== LiveClassStatus.COMPLETED) {
      const enrollments = await Enrollment.find({ course: liveClass.course })
        .select('student');
      
      const studentIds = enrollments.map(enrollment => enrollment.student);
      
      // Create notifications
      const notifications = studentIds.map(studentId => ({
        user: studentId,
        title: 'Live Class Recording Available',
        message: `The recording for "${liveClass.title}" is now available.`,
        type: NotificationType.LIVE_CLASS,
        resourceId: liveClass._id.toString(),
        link: `/courses/${liveClass.course}/live-classes/${liveClass._id}`,
      }));
      
      await Notification.insertMany(notifications);
    }
    
    return res.status(200).json(liveClass);
  } catch (error) {
    console.error('Error updating live class:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a live class
 */
export const deleteLiveClass = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    
    // Find live class
    const liveClass = await LiveClass.findById(id);
    
    if (!liveClass) {
      return res.status(404).json({ message: 'Live class not found' });
    }
    
    // Find course
    const course = await Course.findById(liveClass.course);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Verify user is the instructor or an admin
    const isInstructor = course.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this live class' });
    }
    
    // Delete live class
    await LiveClass.findByIdAndDelete(id);
    
    // Notify enrolled students
    if (liveClass.status === LiveClassStatus.SCHEDULED) {
      const enrollments = await Enrollment.find({ course: liveClass.course })
        .select('student');
      
      const studentIds = enrollments.map(enrollment => enrollment.student);
      
      // Create notifications
      const notifications = studentIds.map(studentId => ({
        user: studentId,
        title: 'Live Class Cancelled',
        message: `The live class "${liveClass.title}" scheduled for ${new Date(liveClass.startTime).toLocaleString()} has been cancelled.`,
        type: NotificationType.LIVE_CLASS,
        resourceId: course._id.toString(),
        link: `/courses/${course._id}/live-classes`,
      }));
      
      await Notification.insertMany(notifications);
    }
    
    return res.status(200).json({ message: 'Live class deleted successfully' });
  } catch (error) {
    console.error('Error deleting live class:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Join a live class
 */
export const joinLiveClass = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    
    // Find live class
    const liveClass = await LiveClass.findById(id);
    
    if (!liveClass) {
      return res.status(404).json({ message: 'Live class not found' });
    }
    
    // Check if student is enrolled in the course
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: liveClass.course,
    });
    
    const isInstructor = liveClass.instructor.toString() === req.user.id;
    const isAdmin = req.user.role === UserRole.ADMIN;
    
    if (!enrollment && !isInstructor && !isAdmin) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }
    
    // Add user to attendees if not already there
    if (!liveClass.attendees.includes(req.user.id)) {
      liveClass.attendees.push(req.user.id);
      await liveClass.save();
    }
    
    return res.status(200).json({ meetingUrl: liveClass.meetingUrl, meetingId: liveClass.meetingId, passcode: liveClass.passcode });
  } catch (error) {
    console.error('Error joining live class:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get upcoming live classes for a student
 */
export const getUpcomingLiveClasses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Get courses the student is enrolled in
    const enrollments = await Enrollment.find({ student: req.user.id })
      .select('course');
    
    const courseIds = enrollments.map(enrollment => enrollment.course);
    
    // Find upcoming live classes
    const now = new Date();
    const liveClasses = await LiveClass.find({
      course: { $in: courseIds },
      startTime: { $gt: now },
      status: LiveClassStatus.SCHEDULED,
    })
      .populate('course', 'title')
      .populate('instructor', 'firstName lastName email profilePicture')
      .sort({ startTime: 1 });
    
    return res.status(200).json(liveClasses);
  } catch (error) {
    console.error('Error getting upcoming live classes:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  createLiveClass,
  getCourseLiveClasses,
  getLiveClass,
  updateLiveClass,
  deleteLiveClass,
  joinLiveClass,
  getUpcomingLiveClasses,
}; 