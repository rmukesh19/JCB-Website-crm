import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  name: { type: String, required: true },
  code: { type: String, required: true },
  type: { type: String, enum: ['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'], default: 'ASSET' },
  balance: { type: Number, default: 0 },
  openingBalance: { type: Number, default: 0 },
  gstApplicable: { type: String, default: 'NO' },
  status: { type: String, default: 'ACTIVE' },
  group: { type: String, default: 'General' }
}, { timestamps: true });

export default mongoose.models.Account || mongoose.model('Account', accountSchema);
