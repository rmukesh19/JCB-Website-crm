import express from 'express';
import { 
  getTemplates, 
  createTemplate, 
  getCampaigns, 
  createCampaign, 
  sendMessage,
  batchSend,
  uploadAttachment,
  uploadImage,
  uploadBase64Image
} from '../controllers/whatsappController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/templates', verifyToken, getTemplates);
router.post('/templates', verifyToken, createTemplate);
router.get('/campaigns', verifyToken, getCampaigns);
router.post('/campaigns', verifyToken, createCampaign);
router.post('/send-message', sendMessage);
router.post('/batch-send', batchSend);
router.post('/upload-image', uploadAttachment.single('image'), uploadImage);
router.post('/upload-base64', uploadBase64Image);



// Meta WhatsApp Webhook verification
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === 'mmt_whatsapp_webhook_2026') {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

router.post('/webhook', (req, res) => {
  console.log('[Meta Webhook]:', JSON.stringify(req.body));
  res.sendStatus(200);
});

export default router;
