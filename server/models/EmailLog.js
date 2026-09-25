import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
  to: { type: String, required: true },
  from: { type: String, default: 'PetPal <no-reply@petpal.local>' },
  subject: { type: String, required: true },
  html: { type: String },
  text: String,
  type: { type: String, enum: ['password_reset', 'welcome', 'order_confirmation', 'adoption_application', 'contact', 'other'], default: 'other' },
  status: { type: String, enum: ['sent', 'queued', 'failed'], default: 'queued' },
  error: String,
  sentAt: Date
}, { timestamps: true });

emailLogSchema.index({ createdAt: -1 });
emailLogSchema.index({ to: 1 });

export default mongoose.model('EmailLog', emailLogSchema);
