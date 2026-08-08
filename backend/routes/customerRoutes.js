import express from 'express';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController.js';
import { verifyToken } from '../middleware/auth.js';
import { validateCustomer } from '../validators/inputValidator.js';

const router = express.Router();

router.get('/', verifyToken, getCustomers);
router.post('/', verifyToken, validateCustomer, createCustomer);
router.put('/:id', verifyToken, updateCustomer);
router.delete('/:id', verifyToken, deleteCustomer);

export default router;
