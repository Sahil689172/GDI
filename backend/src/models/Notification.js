import mongoose from 'mongoose';

export const NOTIFICATION_TYPES = [
  'task_reminder',
  'goal_reminder',
  'overdue',
  'streak_warning',
  'daily_summary',
  'deadline',
  'system',
];

const notificationSchema = new mongoose.Schema(
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
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      default: 'system',
      index: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    relatedGoal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      default: null,
    },
    scheduledFor: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });
notificationSchema.index({ user: 1, scheduledFor: 1 });

export const Notification = mongoose.model('Notification', notificationSchema);
