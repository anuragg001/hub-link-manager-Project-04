import BioProfile from '../../models/BioProfile.js';
import User from '../../models/User.js';

export const getBioByUserId = async (userId) => {
  return await BioProfile.findOne({ userId });
};

export const getBioByUsername = async (username) => {
  const user = await User.findOne({ username }).select('_id');
  if (!user) return null;
  return await BioProfile.findOne({ userId: user._id });
};

export const upsertBio = async (userId, profileData) => {
  const profile = await BioProfile.findOneAndUpdate(
    { userId },
    { $set: profileData },
    { new: true, upsert: true, runValidators: true }
  );
  return profile;
};