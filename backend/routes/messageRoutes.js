import express from 'express';
import { getGigMessages, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/:gigId', getGigMessages);
router.post('/', sendMessage);

export default router;
