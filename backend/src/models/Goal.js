import mongoose from 'mongoose';
import { GOAL_STATUSES, GOAL_CATEGORIES } from '../utils/goalProgress.js';

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    targetDay: { type: Number, default: null },
  },
  { _id: true }
);

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    category: {
      type: String,
      enum: GOAL_CATEGORIES,
      default: 'personal',
      index: true,
    },
    targetDays: {
      type: Number,
      required: true,
      min: [1, 'Target must be at least 1 day'],
      max: [999, 'Target cannot exceed 999 days'],
    },
    daysCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
    startDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: GOAL_STATUSES,
      default: 'active',
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    streakHistory: {
      type: [Number],
      default: () => [0, 0, 0, 0, 0, 0, 0],
    },
    milestones: {
      type: [milestoneSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

goalSchema.index({ user: 1, status: 1, createdAt: -1 });

goalSchema.pre('save', function syncCompletion(next) {
  if (this.status === 'archived') return next();
  const done = this.daysCompleted >= this.targetDays;
  if (done) {
    this.status = 'completed';
    if (!this.completedAt) this.completedAt = new Date();
  } else if (this.status === 'completed') {
    this.status = 'active';
    this.completedAt = null;
  }
  next();
});

export const Goal = mongoose.model('Goal', goalSchema);
