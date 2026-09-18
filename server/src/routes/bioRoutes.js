import express from 'express';
import * as bioController from '../controllers/bioController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { bioSchema } from '../validators/bioValidators.js';

const router = express.Router();

router.get('/public/:username', bioController.getPublicBio);

router.use(protect);
router.get('/me', bioController.getMyBio);
router.put('/me', validate(bioSchema), bioController.updateMyBio);

export default router;