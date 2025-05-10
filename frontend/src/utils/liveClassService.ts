import api from './api';
import { LiveClass, LiveClassPlatform, LiveClassStatus } from '@/types';

/**
 * Create a new live class
 */
export const createLiveClass = async (data: {
  title: string;
  description: string;
  courseId: string;
  startTime: string;
  endTime: string;
  platform: LiveClassPlatform;
  meetingUrl: string;
  meetingId?: string;
  passcode?: string;
}) => {
  try {
    const response = await api.post('/live-classes', data);
    return response.data;
  } catch (error) {
    console.error('Error creating live class:', error);
    throw error;
  }
};

/**
 * Get all live classes for a course
 */
export const getCourseLiveClasses = async (courseId: string, status?: LiveClassStatus) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get(`/live-classes/courses/${courseId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error getting course live classes:', error);
    throw error;
  }
};

/**
 * Get a single live class
 */
export const getLiveClass = async (id: string) => {
  try {
    const response = await api.get(`/live-classes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting live class:', error);
    throw error;
  }
};

/**
 * Update a live class
 */
export const updateLiveClass = async (id: string, data: {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  platform?: LiveClassPlatform;
  meetingUrl?: string;
  meetingId?: string;
  passcode?: string;
  status?: LiveClassStatus;
  recordingUrl?: string;
}) => {
  try {
    const response = await api.put(`/live-classes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating live class:', error);
    throw error;
  }
};

/**
 * Delete a live class
 */
export const deleteLiveClass = async (id: string) => {
  try {
    const response = await api.delete(`/live-classes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting live class:', error);
    throw error;
  }
};

/**
 * Join a live class
 */
export const joinLiveClass = async (id: string) => {
  try {
    const response = await api.post(`/live-classes/${id}/join`);
    return response.data;
  } catch (error) {
    console.error('Error joining live class:', error);
    throw error;
  }
};

/**
 * Get upcoming live classes for a student
 */
export const getUpcomingLiveClasses = async () => {
  try {
    const response = await api.get('/live-classes/upcoming');
    return response.data;
  } catch (error) {
    console.error('Error getting upcoming live classes:', error);
    throw error;
  }
}; 