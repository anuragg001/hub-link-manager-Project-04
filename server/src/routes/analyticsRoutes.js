import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', analyticsController.getDashboard);

export default router;