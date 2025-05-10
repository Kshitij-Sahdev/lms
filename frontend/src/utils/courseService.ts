import api from './api';
import { Course, Module, Lesson } from '@/types';

/**
 * Get all courses with filtering options
 */
export const getAllCourses = async (params?: {
  search?: string;
  instructor?: string;
  published?: boolean;
  limit?: number;
  page?: number;
}) => {
  try {
    const response = await api.get('/courses', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting courses:', error);
    throw error;
  }
};

/**
 * Get a single course by ID
 */
export const getCourseById = async (id: string) => {
  try {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting course:', error);
    throw error;
  }
};

/**
 * Create a new course
 */
export const createCourse = async (data: {
  title: string;
  description: string;
  thumbnail?: string;
}) => {
  try {
    const response = await api.post('/courses', data);
    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

/**
 * Update a course
 */
export const updateCourse = async (id: string, data: {
  title?: string;
  description?: string;
  thumbnail?: string;
  published?: boolean;
}) => {
  try {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

/**
 * Delete a course
 */
export const deleteCourse = async (id: string) => {
  try {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

/**
 * Add a module to a course
 */
export const addModule = async (courseId: string, data: {
  title: string;
  order?: number;
}) => {
  try {
    const response = await api.post(`/courses/${courseId}/modules`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding module:', error);
    throw error;
  }
};

/**
 * Update a module
 */
export const updateModule = async (courseId: string, moduleId: string, data: {
  title?: string;
  order?: number;
}) => {
  try {
    const response = await api.put(`/courses/${courseId}/modules/${moduleId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating module:', error);
    throw error;
  }
};

/**
 * Delete a module
 */
export const deleteModule = async (courseId: string, moduleId: string) => {
  try {
    const response = await api.delete(`/courses/${courseId}/modules/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting module:', error);
    throw error;
  }
};

/**
 * Add a lesson to a module
 */
export const addLesson = async (courseId: string, moduleId: string, data: {
  title: string;
  content: string;
  type: string;
  order?: number;
  duration?: number;
}) => {
  try {
    const response = await api.post(`/courses/${courseId}/modules/${moduleId}/lessons`, data);
    return response.data;
  } catch (error) {
    console.error('Error adding lesson:', error);
    throw error;
  }
};

/**
 * Get courses by instructor
 */
export const getCoursesByInstructor = async (instructorId: string, params?: {
  limit?: number;
  page?: number;
}) => {
  try {
    const response = await api.get(`/courses/instructor/${instructorId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error getting instructor courses:', error);
    throw error;
  }
};

/**
 * Get my courses (as instructor)
 */
export const getMyTeachingCourses = async (params?: {
  limit?: number;
  page?: number;
}) => {
  try {
    const response = await api.get('/courses/me/teaching', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting my courses:', error);
    throw error;
  }
};

/**
 * Get stats for a list of courses
 */
export const getCourseStats = async (courseIds: string[]) => {
  try {
    const response = await api.post('/courses/stats', { courseIds });
    return response.data;
  } catch (error) {
    console.error('Error getting course stats:', error);
    throw error;
  }
};

/**
 * Publish a course
 */
export const publishCourse = async (id: string) => {
  try {
    const response = await api.put(`/courses/${id}`, { published: true });
    return response.data;
  } catch (error) {
    console.error('Error publishing course:', error);
    throw error;
  }
};

/**
 * Unpublish a course
 */
export const unpublishCourse = async (id: string) => {
  try {
    const response = await api.put(`/courses/${id}`, { published: false });
    return response.data;
  } catch (error) {
    console.error('Error unpublishing course:', error);
    throw error;
  }
}; 