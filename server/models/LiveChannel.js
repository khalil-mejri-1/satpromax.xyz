import mongoose from 'mongoose';

const liveChannelSchema = new mongoose.Schema(
  {
    channel_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    logo: {
      type: String,
      default: '',
    },
    category_id: {
      type: Number,
      required: true,
      index: true,
    },
    category_name: {
      type: String,
      default: '',
    },
    category_property: {
      type: String,
      default: '',
    },
    is_premium: {
      type: Number,
      default: 0,
    },
    is_adult: {
      type: Number,
      default: 0,
    },
    index: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast filtering and sorting
liveChannelSchema.index({ category_id: 1, isActive: 1, index: 1 });

export const LiveChannel = mongoose.models.LiveChannel || mongoose.model('LiveChannel', liveChannelSchema);
