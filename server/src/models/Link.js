import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  destinationUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true },
  isVanity: { type: Boolean, default: false },
  totalClicks: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Link', linkSchema);