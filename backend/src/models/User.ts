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
  clerkId?: string;
  requires2FA: boolean;
  passwordHash?: string;
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
      unique: true,
      sparse: true,
    },
    passwordHash: {
      type: String,
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

// Create index only for the role field, as email and clerkId already have indexes via unique: true
UserSchema.index({ role: 1 });

export default mongoose.model<IUser>('User', UserSchema); 