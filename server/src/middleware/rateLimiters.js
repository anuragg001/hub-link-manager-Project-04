import rateLimit from 'express-rate-limit';

export const creationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many links created from this IP, please try again after 15 minutes'
});

export const redirectLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  message: 'Too many requests, please try again later'
});