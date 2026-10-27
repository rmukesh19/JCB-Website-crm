import express from 'express';
import { getDashboardMetrics } from '../controllers/dashboardController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getDashboardMetrics);
router.get('/metrics', verifyToken, getDashboardMetrics);

export default router;
