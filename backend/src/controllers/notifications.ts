import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Notification, { INotification } from '../models/Notification';

/**
 * Get all notifications for the current user
 */
export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { limit = 20, page = 1, read } = req.query;
    
    // Build query
    const query: any = { user: req.user.id };
    
    // Filter by read status if provided
    if (read !== undefined) {
      query.read = read === 'true';
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Find notifications
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    // Count total notifications for pagination
    const totalNotifications = await Notification.countDocuments(query);
    
    // Count unread notifications
    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });
    
    return res.status(200).json({
      notifications,
      totalPages: Math.ceil(totalNotifications / Number(limit)),
      currentPage: Number(page),
      totalNotifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Mark a notification as read
 */
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    
    // Find notification
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Check if notification belongs to the user
    if (notification.user && notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this notification' });
    }
    
    // Mark as read
    notification.set('read', true);
    notification.set('readAt', new Date());
    
    await notification.save();
    
    return res.status(200).json(notification);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Update all unread notifications
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true, readAt: new Date() }
    );
    
    return res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { id } = req.params;
    
    // Find notification
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Check if notification belongs to the user
    if (notification.user && notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this notification' });
    }
    
    // Delete notification
    await Notification.findByIdAndDelete(id);
    
    return res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete all read notifications
 */
export const deleteAllReadNotifications = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Delete all read notifications
    await Notification.deleteMany({
      user: req.user.id,
      read: true,
    });
    
    return res.status(200).json({ message: 'All read notifications deleted successfully' });
  } catch (error) {
    console.error('Error deleting read notifications:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a notification (admin only)
 */
export const createNotification = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Only admins can create notifications for other users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create notifications' });
    }
    
    const { userId, title, message, type, resourceId, link } = req.body;
    
    if (!userId || !title || !message || !type) {
      return res.status(400).json({ message: 'UserId, title, message, and type are required' });
    }
    
    // Create notification
    const notification = new Notification({
      user: userId,
      title,
      message,
      type,
      resourceId,
      link,
      read: false,
    });
    
    await notification.save();
    
    return res.status(201).json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get unread notifications count
 */
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Count unread notifications
    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });
    
    return res.status(200).json({ unreadCount });
  } catch (error) {
    console.error('Error getting unread count:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllReadNotifications,
  createNotification,
  getUnreadCount,
}; 