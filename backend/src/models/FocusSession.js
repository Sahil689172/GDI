import mongoose from 'mongoose';

const focusSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mode: {
      type: String,
      required: true,
      trim: true,
    },
    phase: {
      type: String,
      required: true,
      trim: true,
    },
    minutes: {
      type: Number,
      required: true,
      min: 1,
    },
    completedAt: {
      type: Date,
      required: true,
      index: true,
    },
    hourOfDay: {
      type: Number,
      min: 0,
      max: 23,
    },
  },
  { timestamps: true }
);

focusSessionSchema.index({ user: 1, completedAt: -1 });

export const FocusSession = mongoose.model('FocusSession', focusSessionSchema);
