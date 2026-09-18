import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email address')
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters long')
});