import express from 'express';
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  createJournalVoucher,
  getDayBook,
  getTrialBalance,
  getLedgerStatement
} from '../controllers/accountController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getAccounts);
router.post('/', verifyToken, createAccount);
router.put('/:id', verifyToken, updateAccount);
router.delete('/:id', verifyToken, deleteAccount);
router.post('/journal', verifyToken, createJournalVoucher);
router.get('/transactions', verifyToken, getTransactions);
router.post('/transactions', verifyToken, createTransaction);
router.put('/transactions/:id', verifyToken, updateTransaction);
router.delete('/transactions/:id', verifyToken, deleteTransaction);
router.get('/day-book', verifyToken, getDayBook);
router.get('/trial-balance', verifyToken, getTrialBalance);
router.get('/ledger/:id', verifyToken, getLedgerStatement);

export default router;
