import express from 'express';
import { getBookings, createBooking, updateBooking } from '../controllers/bookingController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getBookings);
router.post('/', verifyToken, createBooking);
router.put('/:id', verifyToken, updateBooking);

export default router;
