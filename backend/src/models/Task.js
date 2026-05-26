import mongoose from 'mongoose';

export const TASK_PRIORITIES = ['low', 'normal', 'high'];

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [500, 'Title cannot exceed 500 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    priority: {
      type: String,
      enum: TASK_PRIORITIES,
      default: 'normal',
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedAt: {
      type: Date,
      default: null,
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

taskSchema.index({ user: 1, workspace: 1, order: 1 });
taskSchema.index({ user: 1, title: 'text' });

export const Task = mongoose.model('Task', taskSchema);
