import mongoose from 'mongoose';

const bioProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  displayName: { type: String, required: true },
  bio: { type: String },
  avatar: { type: String },
  theme: { type: String, enum: ['Minimal Light', 'Dark Slate', 'Gradient'], default: 'Minimal Light' },
  socialLinks: [{
    platform: String,
    url: String
  }]
}, { timestamps: true });

export default mongoose.model('BioProfile', bioProfileSchema);