import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // All booking routes require authentication

router.post('/', createBooking);
router.get('/my-bookings', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id/cancel', cancelBooking);

export default router;
