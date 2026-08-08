import express from 'express';
import { getInvoices, createInvoice, receivePayment } from '../controllers/invoiceController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getInvoices);
router.post('/', verifyToken, createInvoice);
router.post('/:id/payment', verifyToken, receivePayment);

export default router;
