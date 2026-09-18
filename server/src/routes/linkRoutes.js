import express from 'express';
import * as linkController from '../controllers/linkController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateRequest.js';
import { creationLimiter } from '../middleware/rateLimiters.js';
import { createLinkSchema } from '../validators/linkValidators.js';

const router = express.Router();

router.use(protect);

router.post('/', creationLimiter, validate(createLinkSchema), linkController.createLink);
router.get('/', linkController.getLinks);
router.delete('/:id', linkController.deleteLink);

export default router;