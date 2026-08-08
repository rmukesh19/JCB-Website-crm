import express from 'express';
import { getLeads, createLead, updateLead, convertLeadToCustomer } from '../controllers/crmController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/leads', verifyToken, getLeads);
router.post('/leads', verifyToken, createLead);
router.put('/leads/:id', verifyToken, updateLead);
router.post('/leads/:id/convert', verifyToken, convertLeadToCustomer);

export default router;
