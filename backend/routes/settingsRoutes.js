import express from 'express';
import { getCompanies, getBranches, getUsers, getAuditLogs } from '../controllers/settingsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/companies', verifyToken, getCompanies);
router.get('/branches', verifyToken, getBranches);
router.get('/users', verifyToken, getUsers);
router.get('/audit-logs', verifyToken, getAuditLogs);

export default router;
