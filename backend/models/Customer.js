import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  name: { type: String, required: true },
  companyName: { type: String },
  mobile: { type: String },
  phone: { type: String },
  whatsApp: { type: String },
  email: { type: String },
  address: { type: String },
  billingAddress: { type: String },
  district: { type: String },
  gstin: { type: String },
  creditLimit: { type: Number, default: 100000 },
  outstandingBalance: { type: Number, default: 0 },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' }
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema);
