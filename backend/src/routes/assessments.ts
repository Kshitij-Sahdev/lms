import express from 'express';
import assessmentsController from '../controllers/assessments';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Create assessment
router.post('/', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), assessmentsController.createAssessment);

// Get assessments for a course
router.get('/courses/:courseId', authenticate, assessmentsController.getCourseAssessments);

// Get single assessment
router.get('/:id', authenticate, assessmentsController.getAssessment);

// Update assessment
router.put('/:id', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), assessmentsController.updateAssessment);

// Delete assessment
router.delete('/:id', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), assessmentsController.deleteAssessment);

// Submit assessment
router.post('/:id/submit', authenticate, assessmentsController.submitAssessment);

// Get submission for an assessment
router.get('/:id/submission', authenticate, assessmentsController.getSubmission);

// Grade submission
router.put('/submissions/:submissionId/grade', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), assessmentsController.gradeSubmission);

// Get all submissions for an assessment
router.get('/:id/submissions', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), assessmentsController.getAssessmentSubmissions);

export default router; 