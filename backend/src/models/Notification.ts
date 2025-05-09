import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

// Notification types enum
export enum NotificationType {
  COURSE = 'course',
  ASSESSMENT = 'assessment',
  LIVE_CLASS = 'live_class',
  GRADE = 'grade',
  ANNOUNCEMENT = 'announcement',
  SYSTEM = 'system',
}

// Notification priority enum
export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// Notification interface
export interface INotification extends Document {
  user: IUser['_id'];
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  link?: string;
  isRead: boolean;
  resourceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Notification schema
const NotificationSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      default: NotificationType.SYSTEM,
    },
    priority: {
      type: String,
      enum: Object.values(NotificationPriority),
      default: NotificationPriority.MEDIUM,
    },
    link: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    resourceId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
NotificationSchema.index({ user: 1 });
NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema); 