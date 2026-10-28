import express from 'express';
import {
  getDashboardStats,
  getAllBookings
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Apply auth and admin protection to all admin routes
router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/bookings', getAllBookings);

export default router;
