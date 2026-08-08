import express from 'express';
import { getTemplates, createTemplate, getCampaigns, createCampaign } from '../controllers/whatsappController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/templates', verifyToken, getTemplates);
router.post('/templates', verifyToken, createTemplate);
router.get('/campaigns', verifyToken, getCampaigns);
router.post('/campaigns', verifyToken, createCampaign);

export default router;
