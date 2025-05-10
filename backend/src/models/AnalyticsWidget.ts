import mongoose, { Schema, Document } from 'mongoose';

// AnalyticsWidget interface
export interface IAnalyticsWidget extends Document {
  name: string;
  value: number;
  description?: string;
  icon?: string;
  color?: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

// AnalyticsWidget schema
const AnalyticsWidgetSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
      default: 'primary',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAnalyticsWidget>('AnalyticsWidget', AnalyticsWidgetSchema); 