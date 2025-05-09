import { api } from './api';
import { Enrollment } from '@/types';

/**
 * Enroll in a course
 */
export const enrollInCourse = async (courseId: string) => {
  try {
    const response = await api.post(`/enrollments/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

/**
 * Get all enrollments for the current user
 */
export const getMyEnrollments = async (params?: {
  limit?: number;
  page?: number;
}) => {
  try {
    const response = await api.get('/enrollments/me', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting enrollments:', error);
    throw error;
  }
};

/**
 * Get enrollment for a specific course
 */
export const getEnrollment = async (courseId: string) => {
  try {
    const response = await api.get(`/enrollments/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting enrollment:', error);
    throw error;
  }
};

/**
 * Update lesson completion status
 */
export const updateLessonCompletion = async (
  courseId: string,
  lessonId: string,
  completed: boolean
) => {
  try {
    const response = await api.put(`/enrollments/courses/${courseId}/lessons/${lessonId}`, {
      completed,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating lesson completion:', error);
    throw error;
  }
};

/**
 * Get course students (for instructors)
 */
export const getCourseStudents = async (
  courseId: string,
  params?: {
    limit?: number;
    page?: number;
  }
) => {
  try {
    const response = await api.get(`/enrollments/courses/${courseId}/students`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting course students:', error);
    throw error;
  }
};

/**
 * Unenroll from a course
 */
export const unenrollFromCourse = async (courseId: string) => {
  try {
    const response = await api.delete(`/enrollments/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    throw error;
  }
};

/**
 * Check if a user is enrolled in a course
 */
export const isEnrolled = async (courseId: string) => {
  try {
    await getEnrollment(courseId);
    return true;
  } catch (error) {
    return false;
  }
}; 