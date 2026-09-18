import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  linkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Link', required: true },
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  deviceType: String,
  ipHash: String
});

clickSchema.index({ linkId: 1, timestamp: -1 });

export default mongoose.model('Click', clickSchema);