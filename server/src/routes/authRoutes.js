import express from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middleware/validateRequest.js';
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/authValidators.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/verify-email/:token', authController.verifyEmail);
router.post('/login', validate(loginSchema), authController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), authController.resetPassword);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;