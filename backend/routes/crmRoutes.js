import express from 'express';
import { getLeads, createLead, updateLead, convertLeadToCustomer, deleteLead, importLeads, clearAllLeads } from '../controllers/crmController.js';
import { verifyToken } from '../middleware/auth.js';
import excelUploadMiddleware from '../middleware/excelUpload.js';

const router = express.Router();

router.get('/', verifyToken, getLeads);
router.get('/leads', verifyToken, getLeads);
router.post('/leads', verifyToken, createLead);
router.post('/leads/import', verifyToken, excelUploadMiddleware('file'), importLeads);
router.post('/import', verifyToken, excelUploadMiddleware('file'), importLeads);
router.post('/leads/parse-excel', verifyToken, excelUploadMiddleware('file'), (req, res) => {
  res.json({
    success: true,
    count: req.sanitizedRecords?.length || 0,
    records: req.sanitizedRecords || [],
    csvPreview: req.csvString || ''
  });
});
router.delete('/leads/all', verifyToken, clearAllLeads);
router.post('/leads/clear', verifyToken, clearAllLeads);
router.put('/leads/:id', verifyToken, updateLead);
router.delete('/leads/:id', verifyToken, deleteLead);
router.post('/leads/:id/convert', verifyToken, convertLeadToCustomer);

export default router;
