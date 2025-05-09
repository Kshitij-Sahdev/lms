import mongoose, { Schema, Document } from 'mongoose';

// User roles enum
export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

// User interface
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  role: UserRole;
  clerkId: string;
  requires2FA: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User schema
const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    profilePicture: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STUDENT,
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    requires2FA: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ clerkId: 1 });
UserSchema.index({ role: 1 });

export default mongoose.model<IUser>('User', UserSchema); 