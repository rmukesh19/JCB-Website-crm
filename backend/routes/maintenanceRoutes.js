import express from 'express';
import { getMaintenanceRecords, createMaintenanceRecord } from '../controllers/maintenanceController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getMaintenanceRecords);
router.post('/', verifyToken, createMaintenanceRecord);

export default router;
