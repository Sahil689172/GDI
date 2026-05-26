import mongoose from 'mongoose';

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
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },
    targetDays: {
      type: Number,
      required: true,
      min: 1,
      max: 999,
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
  { timestamps: true }
);

goalSchema.index({ user: 1, createdAt: -1 });

export const Goal = mongoose.model('Goal', goalSchema);
