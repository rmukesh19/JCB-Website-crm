import express from 'express';
import { getInvoices, createInvoice, updateInvoice, getInvoiceById, recordPayment } from '../controllers/invoiceController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getInvoices);
router.post('/', verifyToken, createInvoice);
router.get('/:id', verifyToken, getInvoiceById);
router.put('/:id', verifyToken, updateInvoice);
router.post('/:id/payment', verifyToken, recordPayment);

export default router;
