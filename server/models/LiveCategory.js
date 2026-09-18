import mongoose from 'mongoose';

const liveCategorySchema = new mongoose.Schema(
  {
    category_id: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logoUrl: {
      type: String,
      default: '',
    },
    program_total: {
      type: Number,
      default: 0,
    },
    index: {
      type: Number,
      default: 0,
    },
    is_premium: {
      type: Number,
      default: 0,
    },
    is_adult: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const LiveCategory = mongoose.models.LiveCategory || mongoose.model('LiveCategory', liveCategorySchema);
