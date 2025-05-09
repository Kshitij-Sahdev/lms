import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { ICourse } from './Course';

// Live class platform enum
export enum LiveClassPlatform {
  ZOOM = 'zoom',
  GOOGLE_MEET = 'google_meet',
  MICROSOFT_TEAMS = 'microsoft_teams',
  OTHER = 'other',
}

// Live class status
export enum LiveClassStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Live class interface
export interface ILiveClass extends Document {
  title: string;
  description: string;
  course: ICourse['_id'];
  instructor: IUser['_id'];
  startTime: Date;
  endTime: Date;
  platform: LiveClassPlatform;
  meetingUrl: string;
  meetingId?: string;
  passcode?: string;
  status: LiveClassStatus;
  recordingUrl?: string;
  attendees: IUser['_id'][];
  createdAt: Date;
  updatedAt: Date;
}

// Live class schema
const LiveClassSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
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
      enum: Object.values(LiveClassPlatform),
      default: LiveClassPlatform.OTHER,
    },
    meetingUrl: {
      type: String,
      required: true,
    },
    meetingId: {
      type: String,
    },
    passcode: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(LiveClassStatus),
      default: LiveClassStatus.SCHEDULED,
    },
    recordingUrl: {
      type: String,
    },
    attendees: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
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

export default mongoose.model<ILiveClass>('LiveClass', LiveClassSchema); 