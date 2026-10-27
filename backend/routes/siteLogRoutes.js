import express from 'express';
import {
  getSiteLogs,
  getSiteLogById,
  createSiteLog,
  updateSiteLog,
  deleteSiteLog
} from '../controllers/siteLogController.js';
import { verifyToken, optionalToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalToken, getSiteLogs);
router.get('/:id', optionalToken, getSiteLogById);
router.post('/', verifyToken, createSiteLog);
router.put('/:id', verifyToken, updateSiteLog);
router.delete('/:id', verifyToken, deleteSiteLog);

export default router;
