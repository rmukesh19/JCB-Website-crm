import express from 'express';
import { getAccounts, createAccount, updateAccount, deleteAccount, getTransactions, postJournalTransaction } from '../controllers/accountController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getAccounts);
router.post('/', verifyToken, createAccount);
router.put('/:id', verifyToken, updateAccount);
router.delete('/:id', verifyToken, deleteAccount);
router.get('/transactions', verifyToken, getTransactions);
router.post('/journal', verifyToken, postJournalTransaction);

export default router;
