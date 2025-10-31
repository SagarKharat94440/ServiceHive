import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createSwapRequest,
  getSwapRequests,
  respondToSwapRequest,
} from '../controllers/swapController.js';

const router = express.Router();

router.post('/swap-request', authenticate, createSwapRequest);
router.get('/swap-requests', authenticate, getSwapRequests);
router.post('/swap-response/:requestId', authenticate, respondToSwapRequest);

export default router;
