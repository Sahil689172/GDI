import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
      maxlength: [120, 'Name cannot exceed 120 characters'],
    },
    collapsed: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
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

workspaceSchema.index({ user: 1, order: 1 });

export const Workspace = mongoose.model('Workspace', workspaceSchema);
