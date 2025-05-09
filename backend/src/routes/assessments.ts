import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';
import {
  createAssessment,
  getCourseAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  submitAssessment,
  getSubmission,
  gradeSubmission,
  getAssessmentSubmissions
} from '../controllers/assessments';

const router = express.Router();

// Create assessment
router.post('/', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), createAssessment);

// Get all assessments for a course
router.get('/course/:courseId', authenticate, getCourseAssessments);

// Get assessment by ID
router.get('/:id', authenticate, getAssessmentById);

// Update assessment
router.put('/:id', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), updateAssessment);

// Delete assessment
router.delete('/:id', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), deleteAssessment);

// Submit assessment
router.post('/:id/submit', authenticate, submitAssessment);

// Get submission for an assessment
router.get('/:id/submission', authenticate, getSubmission);

// Grade submission
router.put('/submissions/:submissionId/grade', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), gradeSubmission);

// Get all submissions for an assessment
router.get('/:id/submissions', authenticate, authorize([UserRole.TEACHER, UserRole.ADMIN]), getAssessmentSubmissions);

export default router; 