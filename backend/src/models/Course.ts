import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

// Lesson type enum
export enum LessonType {
  VIDEO = 'video',
  PDF = 'pdf',
  LINK = 'link',
  TEXT = 'text',
}

// Lesson interface
export interface ILesson extends Document {
  title: string;
  content: string;
  type: LessonType;
  duration?: number;
  order: number;
}

// Lesson schema
const LessonSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(LessonType),
    required: true,
  },
  duration: {
    type: Number,
  },
  order: {
    type: Number,
    default: 0,
  },
});

// Module interface
export interface IModule extends Document {
  title: string;
  lessons: ILesson[];
  order: number;
}

// Module schema
const ModuleSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  lessons: [LessonSchema],
  order: {
    type: Number,
    default: 0,
  },
});

// Course interface
export interface ICourse extends Document {
  title: string;
  description: string;
  thumbnail?: string;
  instructor: IUser['_id'];
  modules: IModule[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Course schema
const CourseSchema: Schema = new Schema(
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
    thumbnail: {
      type: String,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    modules: [ModuleSchema],
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
CourseSchema.index({ instructor: 1 });
CourseSchema.index({ published: 1 });
CourseSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<ICourse>('Course', CourseSchema); 