import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  date: { type: String, required: true },
  path: { type: String, required: true },
  views: { type: Number, default: 0 }
}, { timestamps: true });

analyticsSchema.index({ date: 1, path: 1 }, { unique: true });
analyticsSchema.index({ date: -1 });

export default mongoose.model('Analytics', analyticsSchema);
