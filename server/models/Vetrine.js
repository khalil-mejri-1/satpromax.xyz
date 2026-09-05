import mongoose from 'mongoose';

// Schema for Vetrine collection
const vetrineSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      required: true,
      default: '12 Months Plan',
    },
    price: {
      type: String,
      default: '$59.99',
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    customerWhatsapp: {
      type: String,
      trim: true,
    },
    deviceType: {
      type: String,
      default: 'FireStick',
    },
    paymentMethod: {
      type: String,
      default: 'card',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'vetrine', // Specifies table/collection name
  }
);

export const Vetrine = mongoose.model('Vetrine', vetrineSchema);
