import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  logo: { type: String },
  gstin: { type: String },
  pan: { type: String },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  website: { type: String },
  invoiceFooter: { type: String },
  qrCode: { type: String },
  bankDetails: { type: String }
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model('Company', companySchema);
