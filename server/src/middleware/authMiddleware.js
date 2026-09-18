import { verifyToken } from '../services/auth/jwtService.js';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return next(new AppError('Not logged in', 401));

    const decoded = verifyToken(token, true);
    if (!decoded) return next(new AppError('Invalid token', 401));

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) return next(new AppError('User no longer exists', 401));

    req.user = currentUser;
    next();
  } catch (err) {
    next(new AppError('Authentication failed', 401));
  }
};