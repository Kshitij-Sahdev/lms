import mongoose, { Schema, Document } from 'mongoose';

// 2FA Code interface
export interface ITwoFactorCode extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

// 2FA Code schema
const TwoFactorCodeSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for email
TwoFactorCodeSchema.index({ email: 1 });

// Create TTL index for automatic cleanup of expired codes
TwoFactorCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Method to check if code is expired
TwoFactorCodeSchema.methods.isExpired = function (): boolean {
  return new Date() > this.expiresAt;
};

export default mongoose.model<ITwoFactorCode>('TwoFactorCode', TwoFactorCodeSchema); 