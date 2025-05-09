import express from 'express';
import notificationsController from '../controllers/notifications';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../models/User';

const router = express.Router();

// Get my notifications
router.get('/me', authenticate, notificationsController.getMyNotifications);

// Mark notification as read
router.put('/:id/read', authenticate, notificationsController.markAsRead);

// Mark all notifications as read
router.put('/read-all', authenticate, notificationsController.markAllAsRead);

// Delete a notification
router.delete('/:id', authenticate, notificationsController.deleteNotification);

// Delete all read notifications
router.delete('/read', authenticate, notificationsController.deleteAllReadNotifications);

// Create a notification (admin only)
router.post('/', authenticate, authorize([UserRole.ADMIN]), notificationsController.createNotification);

// Get unread notifications count
router.get('/unread-count', authenticate, notificationsController.getUnreadCount);

export default router; 