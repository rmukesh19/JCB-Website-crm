import express from 'express';
import { getLeads, createLead, updateLead, convertLeadToCustomer, deleteLead, importLeads, clearAllLeads } from '../controllers/crmController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getLeads);
router.get('/leads', verifyToken, getLeads);
router.post('/leads', verifyToken, createLead);
router.post('/leads/import', verifyToken, importLeads);
router.post('/import', verifyToken, importLeads);
router.delete('/leads/all', verifyToken, clearAllLeads);
router.post('/leads/clear', verifyToken, clearAllLeads);
router.put('/leads/:id', verifyToken, updateLead);
router.delete('/leads/:id', verifyToken, deleteLead);
router.post('/leads/:id/convert', verifyToken, convertLeadToCustomer);

export default router;
