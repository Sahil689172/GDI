import mongoose from 'mongoose';

const focusSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Legacy fields (kept for backwards compatibility)
    mode: {
      type: String,
      trim: true,
      default: null,
    },
    phase: {
      type: String,
      trim: true,
      default: null,
    },
    minutes: {
      type: Number,
      min: 0,
      default: 0,
    },
    completedAt: {
      type: Date,
      index: true,
      default: null,
    },
    hourOfDay: {
      type: Number,
      min: 0,
      max: 23,
      default: null,
    },

    // New focus engine fields
    sessionType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    startedAt: {
      type: Date,
      required: true,
      index: true,
    },
    endedAt: {
      type: Date,
      default: null,
      index: true,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    notes: {
      type: String,
      default: '',
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

focusSessionSchema.index({ user: 1, startedAt: -1 });
focusSessionSchema.index({ user: 1, completed: 1, endedAt: -1 });

export const FocusSession = mongoose.model('FocusSession', focusSessionSchema);
