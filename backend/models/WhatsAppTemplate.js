import mongoose from 'mongoose';

const whatsAppTemplateSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  name: { type: String, required: true },
  type: { type: String, required: true },
  body: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.WhatsAppTemplate || mongoose.model('WhatsAppTemplate', whatsAppTemplateSchema);
