import jwt from 'jsonwebtoken';
import env from '../../config/env.js';
import User from '../../models/User.js';

export const signAccess = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, { expiresIn: '15m' });
};

export const signRefresh = (id, tokenVersion) => {
  return jwt.sign({ id, tokenVersion }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token, isAccess = true) => {
  try {
    return jwt.verify(token, isAccess ? env.JWT_SECRET : env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

export const rotateRefreshToken = async (oldToken) => {
  const decoded = verifyToken(oldToken, false);
  if (!decoded) return null;

  const user = await User.findById(decoded.id);
  if (!user || user.tokenVersion !== decoded.tokenVersion) return null;

  user.tokenVersion += 1;
  await user.save({ validateBeforeSave: false });

  return {
    accessToken: signAccess(user._id),
    refreshToken: signRefresh(user._id, user.tokenVersion)
  };
};

export const revokeAll = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.tokenVersion += 1;
    await user.save({ validateBeforeSave: false });
  }
};