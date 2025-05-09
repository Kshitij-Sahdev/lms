import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { ICourse } from './Course';

// Enrollment progress interface
export interface IEnrollmentProgress {
  moduleId: string;
  completedLessons: string[]; // Lesson IDs
  progress: number; // Percentage
}

// Enrollment progress schema
const EnrollmentProgressSchema: Schema = new Schema({
  moduleId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  completedLessons: [String],
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
});

// Enrollment interface
export interface IEnrollment extends Document {
  student: IUser['_id'];
  course: ICourse['_id'];
  completedLessons: string[]; // Lesson IDs
  progress: IEnrollmentProgress[];
  overallProgress: number; // Percentage
  isCompleted: boolean;
  lastAccessed?: Date;
  enrolledAt: Date;
  completedAt?: Date;
}

// Enrollment schema
const EnrollmentSchema: Schema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  completedLessons: [String],
  progress: [EnrollmentProgressSchema],
  overallProgress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  lastAccessed: {
    type: Date,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});

// Create compound index for student-course pair
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Create indexes for common queries
EnrollmentSchema.index({ student: 1 });
EnrollmentSchema.index({ course: 1 });
EnrollmentSchema.index({ isCompleted: 1 });

export default mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema); 