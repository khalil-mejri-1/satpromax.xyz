import mongoose from 'mongoose';

const siteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main_site_content',
      unique: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    lastUpdatedBy: {
      type: String,
      default: 'admin@gmail.com',
    },
  },
  {
    timestamps: true,
    collection: 'site_content',
  }
);

export const SiteContent = mongoose.model('SiteContent', siteContentSchema);
