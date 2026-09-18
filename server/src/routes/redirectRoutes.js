import express from 'express';
import * as redirectController from '../controllers/redirectController.js';
import { redirectLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.get('/:shortCode', redirectLimiter, redirectController.handleRedirect);

export default router;