import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IAssessment } from './Assessment';

// Submission status enum
export enum SubmissionStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
  LATE = 'late',
}

// Answer to a question
export interface IAnswer {
  questionId: string;
  selectedOptions?: string[]; // For multiple choice
  textAnswer?: string; // For text/short answer
  isCorrect?: boolean;
  pointsEarned?: number;
}

const AnswerSchema: Schema = new Schema({
  questionId: {
    type: String,
    required: true,
  },
  selectedOptions: [{
    type: String,
  }],
  textAnswer: {
    type: String,
  },
  isCorrect: {
    type: Boolean,
  },
  pointsEarned: {
    type: Number,
  },
});

// Submission interface
export interface ISubmission extends Document {
  student: IUser['_id'];
  assessment: IAssessment['_id'];
  answers: IAnswer[];
  fileUrl?: string;
  textContent?: string;
  linkUrl?: string;
  status: SubmissionStatus;
  score?: number;
  feedback?: string;
  gradedBy?: IUser['_id'];
  submittedAt?: Date;
  gradedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Submission schema
const SubmissionSchema: Schema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assessment: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    answers: [AnswerSchema],
    fileUrl: {
      type: String,
    },
    textContent: {
      type: String,
    },
    linkUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(SubmissionStatus),
      default: SubmissionStatus.DRAFT,
    },
    score: {
      type: Number,
    },
    feedback: {
      type: String,
    },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    submittedAt: {
      type: Date,
    },
    gradedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for student-assessment pair
SubmissionSchema.index({ student: 1, assessment: 1 }, { unique: true });

// Create indexes for common queries
SubmissionSchema.index({ assessment: 1 });
SubmissionSchema.index({ student: 1 });
SubmissionSchema.index({ status: 1 });

export default mongoose.model<ISubmission>('Submission', SubmissionSchema); 