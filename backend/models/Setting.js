import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  companyId: { type: Number, default: 1 },
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.models.Setting || mongoose.model('Setting', settingSchema);
