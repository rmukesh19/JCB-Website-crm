import express from 'express';
import { getFinancialReport, getMachineUtilizationReport } from '../controllers/reportsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/financial', verifyToken, getFinancialReport);
router.get('/utilization', verifyToken, getMachineUtilizationReport);

export default router;
