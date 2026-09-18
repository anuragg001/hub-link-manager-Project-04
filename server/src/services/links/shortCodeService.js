import crypto from 'crypto';
import Link from '../../models/Link.js';
import AppError from '../../utils/AppError.js';

const generateBase62 = (length = 6) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[crypto.randomInt(0, chars.length)];
  }
  return result;
};

export const generateUniqueCode = async (destinationUrl, userId, maxRetries = 5) => {
  for (let i = 0; i < maxRetries; i++) {
    const code = generateBase62();
    try {
      const link = await Link.create({
        userId,
        destinationUrl,
        shortCode: code,
        isVanity: false
      });
      return link;
    } catch (error) {
      if (error.code !== 11000) throw error;
    }
  }
  throw new AppError('Failed to generate a unique short code after multiple attempts', 500);
};

export const validateVanitySlug = async (slug, destinationUrl, userId) => {
  const reservedWords = ['api', 'login', 'signup', 'dashboard', 'admin'];
  if (reservedWords.includes(slug.toLowerCase())) {
    throw new AppError('This slug is reserved and cannot be used', 400);
  }
  if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
    throw new AppError('Vanity slug must contain only alphanumeric characters and hyphens', 400);
  }

  try {
    const link = await Link.create({
      userId,
      destinationUrl,
      shortCode: slug,
      isVanity: true
    });
    return link;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Vanity slug is already taken', 409);
    }
    throw error;
  }
};