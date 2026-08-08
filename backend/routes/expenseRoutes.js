import express from 'express';
import { getExpenses, createExpense } from '../controllers/expenseController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getExpenses);
router.post('/', verifyToken, createExpense);

export default router;
