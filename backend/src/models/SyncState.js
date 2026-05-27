import mongoose from 'mongoose';

const syncStateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    deviceId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
      index: true,
    },
    lastPulledAt: { type: Date, default: null },
    lastPushedAt: { type: Date, default: null },
    lastSyncedAt: { type: Date, default: null },
    lastError: {
      message: { type: String, default: null },
      at: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

syncStateSchema.index({ user: 1, deviceId: 1 }, { unique: true });

export const SyncState = mongoose.model('SyncState', syncStateSchema);

