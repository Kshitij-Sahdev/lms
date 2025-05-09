import express from 'express';
import liveClassesController from '../controllers/liveClasses';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Create live class
router.post('/', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), liveClassesController.createLiveClass);

// Get all live classes for a course
router.get('/courses/:courseId', authenticate, liveClassesController.getCourseLiveClasses);

// Get a single live class
router.get('/:id', authenticate, liveClassesController.getLiveClass);

// Update a live class
router.put('/:id', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), liveClassesController.updateLiveClass);

// Delete a live class
router.delete('/:id', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), liveClassesController.deleteLiveClass);

// Join a live class
router.post('/:id/join', authenticate, liveClassesController.joinLiveClass);

// Get upcoming live classes for a student
router.get('/upcoming', authenticate, liveClassesController.getUpcomingLiveClasses);

export default router; 