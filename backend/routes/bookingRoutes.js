import express from 'express';
import { getBookings, createBooking, updateBooking, deleteBooking } from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getBookings);
router.post('/', verifyToken, createBooking);
router.put('/:id', verifyToken, updateBooking);
router.delete('/:id', verifyToken, deleteBooking);

export default router;
