import mongoose from 'mongoose';

const whatsAppCampaignSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  campaignName: { type: String, required: true },
  templateId: { type: Number },
  targetAudience: { type: String, default: 'All Leads' },
  status: { type: String, enum: ['DRAFT', 'SCHEDULED', 'RUNNING', 'COMPLETED', 'FAILED'], default: 'DRAFT' },
  sentCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  scheduledAt: { type: String }
}, { timestamps: true });

export default mongoose.models.WhatsAppCampaign || mongoose.model('WhatsAppCampaign', whatsAppCampaignSchema);
