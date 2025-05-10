import api from './api';
import { Notification } from '@/types';

/**
 * Get all notifications for the current user
 */
export const getMyNotifications = async (params?: {
  limit?: number;
  page?: number;
  read?: boolean;
}) => {
  try {
    const response = await api.get('/notifications/me', { params });
    return response.data;
  } catch (error) {
    console.error('Error getting notifications:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (id: string) => {
  try {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async () => {
  try {
    const response = await api.put('/notifications/read-all');
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (id: string) => {
  try {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Delete all read notifications
 */
export const deleteAllReadNotifications = async () => {
  try {
    const response = await api.delete('/notifications/read');
    return response.data;
  } catch (error) {
    console.error('Error deleting read notifications:', error);
    throw error;
  }
};

/**
 * Create a notification (admin only)
 */
export const createNotification = async (data: {
  userId: string;
  title: string;
  message: string;
  type: string;
  resourceId?: string;
  link?: string;
}) => {
  try {
    const response = await api.post('/notifications', data);
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Get unread notifications count
 */
export const getUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  } catch (error) {
    console.error('Error getting unread count:', error);
    throw error;
  }
}; 