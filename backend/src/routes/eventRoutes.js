import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getEvents,
  createEvent,
  updateEvent,
  getSwappableSlots,
} from '../controllers/eventController.js';

const router = express.Router();

router.get('/events', authenticate, getEvents);
router.post('/events', authenticate, createEvent);
router.patch('/events/:id', authenticate, updateEvent);
router.get('/swappable-slots', authenticate, getSwappableSlots);

export default router;
