import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

// Notification type enum
export enum NotificationType {
  COURSE = 'course',
  ASSIGNMENT = 'assignment',
  ANNOUNCEMENT = 'announcement',
  LIVE_CLASS = 'live_class',
  SYSTEM = 'system',
  GRADE = 'grade',
}

// Notification interface
export interface INotification extends Document {
  user: IUser['_id'];
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  resourceId?: string; // ID of the related resource (course, assignment, etc.)
  createdAt: Date;
  readAt?: Date;
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
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
    },
    resourceId: {
      type: String,
    },
    readAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
NotificationSchema.index({ user: 1 });
NotificationSchema.index({ read: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema); 