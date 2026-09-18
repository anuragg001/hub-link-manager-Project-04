import crypto from 'crypto';
import User from '../models/User.js';
import * as jwtService from '../services/auth/jwtService.js';
import * as passwordService from '../services/auth/passwordService.js';
import env from '../config/env.js';
import AppError from '../utils/AppError.js';

const sendTokens = (user, statusCode, res) => {
  const accessToken = jwtService.signAccess(user._id);
  const refreshToken = jwtService.signRefresh(user._id, user.tokenVersion);

  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  res.cookie('accessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
  res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  res.status(statusCode).json({
    status: 'success',
    user: { id: user._id, username: user.username, email: user.email, isVerified: user.isVerified }
  });
};

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) return next(new AppError('Username or email already in use', 400));

    // Generate random verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    const user = await User.create({ 
      username, 
      email, 
      password,
      verificationToken: hashedToken,
      isVerified: false
    });

    const verificationLink = `http://localhost:5173/verify-email/${verificationToken}`;

    res.status(201).json({
      status: 'success',
      message: 'Registration successful! Please verify your email.',
      simulatedEmailLink: verificationLink
    });
  } catch (error) { next(error); }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({ verificationToken: hashedToken });
    
    if (!user) return next(new AppError('Invalid or expired verification token', 400));

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ status: 'success', message: 'Email verified successfully! You can now log in.' });
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }
    
    if (!user.isVerified) {
      return next(new AppError('Please verify your email address before logging in.', 403));
    }
    
    sendTokens(user, 200, res);
  } catch (error) { next(error); }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new AppError('No user found with that email address', 404));

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

    await user.save({ validateBeforeSave: false });

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    res.status(200).json({
      status: 'success',
      message: 'Password reset link generated.',
      simulatedEmailLink: resetLink
    });
  } catch (error) { next(error); }
};

export const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return next(new AppError('Token is invalid or has expired', 400));

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    // Invalidate old sessions!
    user.tokenVersion += 1;
    await user.save();

    sendTokens(user, 200, res);
  } catch (error) { next(error); }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return next(new AppError('No refresh token provided', 401));

    const newTokens = await jwtService.rotateRefreshToken(token);
    if (!newTokens) return next(new AppError('Invalid or expired refresh token', 401));

    const cookieOptions = {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax'
    };
    res.cookie('accessToken', newTokens.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie('refreshToken', newTokens.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({ status: 'success' });
  } catch (error) { next(error); }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ status: 'success' });
  } catch (error) { next(error); }
};