import express from 'express';
import { getDieselRecords, createDieselRecord } from '../controllers/dieselController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getDieselRecords);
router.post('/', verifyToken, createDieselRecord);

export default router;
