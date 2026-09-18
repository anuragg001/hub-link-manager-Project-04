import crypto from 'crypto';
import User from '../../models/User.js';
import { sendResetEmail } from './emailService.js';

export const createResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  await sendResetEmail(user.email, resetToken);
  return resetToken;
};

export const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) return false;

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  user.tokenVersion += 1;
  await user.save();
  return true;
};