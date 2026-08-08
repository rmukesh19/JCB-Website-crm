import WhatsAppTemplate from '../models/WhatsAppTemplate.js';
import WhatsAppCampaign from '../models/WhatsAppCampaign.js';
import { isDbConnected, memoryStore } from '../services/memoryStore.js';

export const getTemplates = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const templates = await WhatsAppTemplate.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(templates);
      } catch (dbErr) {
        console.warn('getTemplates DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.whatsAppTemplates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTemplate = async (req, res) => {
  try {
    let template = null;
    if (isDbConnected()) {
      try {
        const count = await WhatsAppTemplate.countDocuments();
        const id = count + 1;
        template = new WhatsAppTemplate({
          id,
          companyId: req.currentUser?.companyId || 1,
          ...req.body
        });
        await template.save();
      } catch (dbErr) {
        console.warn('createTemplate DB fallback:', dbErr.message);
      }
    }

    if (!template) {
      const id = memoryStore.whatsAppTemplates.length + 1;
      template = {
        id,
        companyId: req.currentUser?.companyId || 1,
        ...req.body
      };
      memoryStore.whatsAppTemplates.push(template);
    }

    return res.json(template);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const campaigns = await WhatsAppCampaign.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(campaigns);
      } catch (dbErr) {
        console.warn('getCampaigns DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.whatsAppCampaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createCampaign = async (req, res) => {
  try {
    let campaign = null;
    if (isDbConnected()) {
      try {
        const count = await WhatsAppCampaign.countDocuments();
        const id = count + 1;
        campaign = new WhatsAppCampaign({
          id,
          companyId: req.currentUser?.companyId || 1,
          ...req.body
        });
        await campaign.save();
      } catch (dbErr) {
        console.warn('createCampaign DB fallback:', dbErr.message);
      }
    }

    if (!campaign) {
      const id = memoryStore.whatsAppCampaigns.length + 1;
      campaign = {
        id,
        companyId: req.currentUser?.companyId || 1,
        ...req.body
      };
      memoryStore.whatsAppCampaigns.push(campaign);
    }

    return res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
