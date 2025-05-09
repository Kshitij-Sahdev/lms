import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { ICourse } from './Course';

// LiveClass status enum
export enum LiveClassStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// LiveClass interface
export interface ILiveClass extends Document {
  title: string;
  description?: string;
  course: ICourse['_id'];
  instructor: IUser['_id'];
  startTime: Date;
  endTime: Date;
  platform?: string;
  meetingUrl?: string;
  meetingId?: string;
  passcode?: string;
  recordingUrl?: string;
  status: LiveClassStatus;
  attendees: Array<IUser['_id']>;
  isRecurring: boolean;
  recursOn?: string[];
  maxParticipants?: number;
  isCancelled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// LiveClass schema
const LiveClassSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    platform: {
      type: String,
      default: 'Zoom',
    },
    meetingUrl: {
      type: String,
    },
    meetingId: {
      type: String,
    },
    passcode: {
      type: String,
    },
    recordingUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(LiveClassStatus),
      default: LiveClassStatus.SCHEDULED,
    },
    attendees: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recursOn: [{
      type: String,
      enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    }],
    maxParticipants: {
      type: Number,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
LiveClassSchema.index({ course: 1 });
LiveClassSchema.index({ instructor: 1 });
LiveClassSchema.index({ startTime: 1 });
LiveClassSchema.index({ status: 1 });
LiveClassSchema.index({ isCancelled: 1 });

export default mongoose.model<ILiveClass>('LiveClass', LiveClassSchema); 