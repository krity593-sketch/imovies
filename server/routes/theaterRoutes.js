import express from 'express';
import {
  getTheaters,
  getCities,
  getTheaterById,
  createTheater,
  updateTheater,
  deleteTheater
} from '../controllers/theaterController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTheaters);
router.get('/cities', getCities);
router.get('/:id', getTheaterById);

// Admin Routes
router.post('/', protect, adminOnly, createTheater);
router.put('/:id', protect, adminOnly, updateTheater);
router.delete('/:id', protect, adminOnly, deleteTheater);

export default router;
