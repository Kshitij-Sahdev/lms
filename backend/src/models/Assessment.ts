import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { ICourse } from './Course';

// Assessment types enum
export enum AssessmentType {
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
}

// Question types enum
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  FILE_UPLOAD = 'file_upload',
}

// Question option interface
export interface IQuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

// Question option schema
const QuestionOptionSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
});

// Question interface
export interface IQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: IQuestionOption[];
  points: number;
  correctAnswer?: string;
}

// Question schema
const QuestionSchema: Schema = new Schema({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(QuestionType),
    required: true,
  },
  options: [QuestionOptionSchema],
  points: {
    type: Number,
    default: 1,
  },
  correctAnswer: {
    type: String,
  },
});

// Submission types enum
export enum SubmissionType {
  FILE = 'file',
  TEXT = 'text',
  LINK = 'link',
  AUTOGRADED = 'autograded',
}

// Assessment interface
export interface IAssessment extends Document {
  title: string;
  description?: string;
  course: ICourse['_id'];
  type: AssessmentType;
  questions: IQuestion[];
  dueDate?: Date;
  createdBy: IUser['_id'];
  createdAt: Date;
  updatedAt: Date;
}

// Assessment schema
const AssessmentSchema: Schema = new Schema(
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
    type: {
      type: String,
      enum: Object.values(AssessmentType),
      required: true,
    },
    questions: [QuestionSchema],
    dueDate: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
AssessmentSchema.index({ course: 1 });
AssessmentSchema.index({ createdBy: 1 });
AssessmentSchema.index({ dueDate: 1 });
AssessmentSchema.index({ type: 1 });

export default mongoose.model<IAssessment>('Assessment', AssessmentSchema); 