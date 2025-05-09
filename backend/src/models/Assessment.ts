import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { ICourse } from './Course';

// Question types enum
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SINGLE_CHOICE = 'single_choice',
  TRUE_FALSE = 'true_false',
  SHORT_ANSWER = 'short_answer',
}

// Question option interface
export interface IQuestionOption extends Document {
  text: string;
  isCorrect: boolean;
}

// Question option schema
const QuestionOptionSchema: Schema = new Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
    default: false,
  },
});

// Question interface
export interface IQuestion extends Document {
  text: string;
  type: QuestionType;
  options: IQuestionOption[];
  points: number;
}

// Question schema
const QuestionSchema: Schema = new Schema({
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
    required: true,
    default: 1,
  },
});

// Assessment types enum
export enum AssessmentType {
  QUIZ = 'quiz',
  ASSIGNMENT = 'assignment',
}

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
  description: string;
  course: ICourse['_id'];
  type: AssessmentType;
  questions: IQuestion[];
  dueDate?: Date;
  timeLimit?: number; // in minutes, for quizzes
  passingScore: number;
  points: number;
  submissionType: SubmissionType;
  published: boolean;
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
      required: true,
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
    timeLimit: {
      type: Number,
    },
    passingScore: {
      type: Number,
      default: 60,
    },
    points: {
      type: Number,
      required: true,
      default: 100,
    },
    submissionType: {
      type: String,
      enum: Object.values(SubmissionType),
      default: SubmissionType.AUTOGRADED,
    },
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
AssessmentSchema.index({ course: 1 });
AssessmentSchema.index({ type: 1 });
AssessmentSchema.index({ published: 1 });

export default mongoose.model<IAssessment>('Assessment', AssessmentSchema); 