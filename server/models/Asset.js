import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true },
  originalName: String,
  url: String
}, { timestamps: true });

export default mongoose.model('Asset', assetSchema);
