import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IAssessment } from './Assessment';

// Submission status enum
export enum SubmissionStatus {
  PENDING = 'pending',
  GRADED = 'graded',
  RESUBMITTED = 'resubmitted',
}

// Submission answer interface
export interface ISubmissionAnswer {
  questionId: string;
  answer: string;
  points?: number;
  feedback?: string;
}

// Submission answer schema
const SubmissionAnswerSchema: Schema = new Schema({
  questionId: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
  },
  feedback: {
    type: String,
  },
});

// Submission interface
export interface ISubmission extends Document {
  student: IUser['_id'];
  assessment: IAssessment['_id'];
  answers: ISubmissionAnswer[];
  status: SubmissionStatus;
  score?: number;
  feedback?: string;
  submittedAt: Date;
  gradedAt?: Date;
  gradedBy?: IUser['_id'];
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
    answers: [SubmissionAnswerSchema],
    status: {
      type: String,
      enum: Object.values(SubmissionStatus),
      default: SubmissionStatus.PENDING,
    },
    score: {
      type: Number,
    },
    feedback: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    gradedAt: {
      type: Date,
    },
    gradedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for student-assessment pair
SubmissionSchema.index({ student: 1, assessment: 1 }, { unique: true });

// Create indexes for faster queries
SubmissionSchema.index({ assessment: 1 });
SubmissionSchema.index({ student: 1 });
SubmissionSchema.index({ status: 1 });
SubmissionSchema.index({ submittedAt: -1 });

export default mongoose.model<ISubmission>('Submission', SubmissionSchema); 