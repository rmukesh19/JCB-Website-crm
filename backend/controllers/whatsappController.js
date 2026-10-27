import path from 'path';
import fs from 'fs';
import multer from 'multer';
import db from '../services/memoryStore.js';
import { sendWhatsAppMessage, sendWhatsAppDirectText } from '../services/whatsappService.js';

// Setup multer storage for WhatsApp image attachments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `wa-attachment-${uniqueSuffix}${ext}`);
  }
});

export const uploadAttachment = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

export const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image file uploaded' });
  }
  const relativeUrl = `/uploads/${req.file.filename}`;
  const fullUrl = `https://crm.mmtenterprises.in${relativeUrl}`;
  return res.json({
    success: true,
    filename: req.file.filename,
    url: relativeUrl,
    fullUrl: fullUrl
  });
};

export const uploadBase64Image = (req, res) => {
  try {
    const { dataUrl, filename } = req.body;
    if (!dataUrl) {
      return res.status(400).json({ success: false, error: 'No image data provided' });
    }
    const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, error: 'Invalid base64 image data' });
    }
    const ext = matches[1].split('/')[1] || 'jpg';
    const buffer = Buffer.from(matches[2], 'base64');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const safeName = `wa-attachment-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    fs.writeFileSync(path.join(uploadDir, safeName), buffer);
    const relativeUrl = `/uploads/${safeName}`;
    const fullUrl = `https://crm.mmtenterprises.in${relativeUrl}`;
    return res.json({ success: true, filename: safeName, url: relativeUrl, fullUrl: fullUrl });
  } catch (err) {
    console.error('Base64 upload error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getTemplates = async (req, res) => res.json({ success: true, data: db.whatsappTemplates });
export const createTemplate = async (req, res) => {
  const t = { id: db.whatsappTemplates.length + 1, ...req.body };
  db.whatsappTemplates.push(t);
  res.status(201).json({ success: true, data: t });
};
export const getCampaigns = async (req, res) => res.json({ success: true, data: db.whatsappCampaigns });
export const createCampaign = async (req, res) => {
  const c = { id: db.whatsappCampaigns.length + 1, status: 'QUEUED', ...req.body };
  db.whatsappCampaigns.push(c);
  res.status(201).json({ success: true, data: c });
};

export const sendMessage = async (req, res) => {
  try {
    const { to, message, imageUrl, customerName, sector } = req.body;
    if (!to || (!message && !imageUrl)) {
      return res.status(400).json({ success: false, error: 'Recipient phone number and message/image are required.' });
    }

    const result = await sendWhatsAppMessage({ to, text: message, imageUrl, customerName, sector });
    if (result.success) {
      return res.json({ success: true, messageId: result.messageId, recipient: to });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error,
        code: result.code,
        hint: result.code === 131047 ? '24-hour customer service window expired. Use "Open in WhatsApp" button to send directly to this customer.' : undefined
      });
    }
  } catch (err) {
    console.error('Error in sendMessage controller:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const batchSend = async (req, res) => {
  try {
    const { recipients, message, imageUrl, sector } = req.body;
    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ success: false, error: 'No recipients provided for batch send' });
    }
    if (!message && !imageUrl) {
      return res.status(400).json({ success: false, error: 'Message or image is required' });
    }

    const results = [];
    let sentCount = 0;
    let failedCount = 0;

    for (const item of recipients) {
      const phone = item.mobileNumber || item.whatsAppNumber || item.to || item.phone;
      if (!phone) {
        results.push({ name: item.customerName || 'Unknown', phone: '', success: false, error: 'Missing phone' });
        failedCount++;
        continue;
      }

      const cleanNum = String(phone).replace(/\D/g, '');
      if (cleanNum === '9626546679' || cleanNum === '919626546679') {
        results.push({ name: item.customerName, phone, success: false, error: 'Sender business number' });
        failedCount++;
        continue;
      }

      let personalizedMessage = message || '';
      if (item.customerName) {
        personalizedMessage = personalizedMessage.replace(/\[Customer Name\]/g, item.customerName);
      }
      if (item.companyName) {
        personalizedMessage = personalizedMessage.replace(/PP Sons Construction/g, item.companyName);
      }

      const resItem = await sendWhatsAppMessage({
        to: phone,
        text: personalizedMessage,
        imageUrl: imageUrl || undefined,
        customerName: item.customerName,
        sector: sector || item.customerType
      });

      if (resItem.success) {
        sentCount++;
        results.push({ name: item.customerName, phone, success: true, messageId: resItem.messageId });
      } else {
        failedCount++;
        results.push({ name: item.customerName, phone, success: false, error: resItem.error, code: resItem.code });
      }

      await new Promise(r => setTimeout(r, 200));
    }

    return res.json({
      success: true,
      total: recipients.length,
      sentCount,
      failedCount,
      results
    });
  } catch (err) {
    console.error('Error in batchSend controller:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};


