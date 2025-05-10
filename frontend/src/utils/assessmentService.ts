import api from './api';
import { Assessment, AssessmentType, Question, Submission, SubmissionType } from '@/types';

/**
 * Get assessments for a course
 */
export const getCourseAssessments = async (courseId: string, type?: AssessmentType) => {
  try {
    const params = type ? { type } : {};
    const response = await api.get(`/assessments/courses/${courseId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error getting course assessments:', error);
    throw error;
  }
};

/**
 * Get assessment by ID
 */
export const getAssessment = async (id: string) => {
  try {
    const response = await api.get(`/assessments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting assessment:', error);
    throw error;
  }
};

/**
 * Create a new assessment
 */
export const createAssessment = async (data: {
  title: string;
  description: string;
  courseId: string;
  type: AssessmentType;
  questions?: Question[];
  dueDate?: string;
  timeLimit?: number;
  passingScore?: number;
  points?: number;
  submissionType?: SubmissionType;
}) => {
  try {
    const response = await api.post('/assessments', data);
    return response.data;
  } catch (error) {
    console.error('Error creating assessment:', error);
    throw error;
  }
};

/**
 * Update an assessment
 */
export const updateAssessment = async (id: string, data: {
  title?: string;
  description?: string;
  questions?: Question[];
  dueDate?: string;
  timeLimit?: number;
  passingScore?: number;
  points?: number;
  submissionType?: SubmissionType;
  published?: boolean;
}) => {
  try {
    const response = await api.put(`/assessments/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating assessment:', error);
    throw error;
  }
};

/**
 * Delete an assessment
 */
export const deleteAssessment = async (id: string) => {
  try {
    const response = await api.delete(`/assessments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting assessment:', error);
    throw error;
  }
};

/**
 * Submit an assessment
 */
export const submitAssessment = async (id: string, data: {
  answers?: any[];
  fileUrl?: string;
  textContent?: string;
  linkUrl?: string;
}) => {
  try {
    const response = await api.post(`/assessments/${id}/submit`, data);
    return response.data;
  } catch (error) {
    console.error('Error submitting assessment:', error);
    throw error;
  }
};

/**
 * Get submission for an assessment
 */
export const getSubmission = async (assessmentId: string) => {
  try {
    const response = await api.get(`/assessments/${assessmentId}/submission`);
    return response.data;
  } catch (error) {
    console.error('Error getting submission:', error);
    throw error;
  }
};

/**
 * Grade a submission (for instructors)
 */
export const gradeSubmission = async (submissionId: string, data: {
  score: number;
  feedback?: string;
}) => {
  try {
    const response = await api.put(`/assessments/submissions/${submissionId}/grade`, data);
    return response.data;
  } catch (error) {
    console.error('Error grading submission:', error);
    throw error;
  }
};

/**
 * Get all submissions for an assessment (for instructors)
 */
export const getAssessmentSubmissions = async (assessmentId: string, status?: string) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get(`/assessments/${assessmentId}/submissions`, { params });
    return response.data;
  } catch (error) {
    console.error('Error getting assessment submissions:', error);
    throw error;
  }
}; 