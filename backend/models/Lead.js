import mongoose from 'mongoose';

const followUpSchema = new mongoose.Schema({
  id: { type: Number },
  date: { type: String },
  followUpType: { type: String },
  remarks: { type: String },
  nextFollowUpDate: { type: String },
  nextFollowUpTime: { type: String },
  executiveName: { type: String }
});

const quotationSchema = new mongoose.Schema({
  id: { type: Number },
  quotationNumber: { type: String },
  date: { type: String },
  machineModel: { type: String },
  billingType: { type: String },
  rate: { type: Number },
  subtotal: { type: Number },
  taxAmount: { type: Number },
  grandTotal: { type: Number },
  status: { type: String, enum: ['SENT', 'APPROVED', 'REJECTED'], default: 'SENT' }
});

const leadSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  customerName: { type: String, default: '' },
  companyName: { type: String },
  mobileNumber: { type: String },
  whatsAppNumber: { type: String },
  email: { type: String },
  address: { type: String },
  district: { type: String },
  businessType: { type: String },
  customerType: { type: String },
  interestedMachine: { type: String },
  rentalRequirement: { type: String },
  leadSource: { type: String },
  marketingExecutive: { type: String },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
  expectedBookingDate: { type: String },
  remarks: { type: String },
  status: { type: String, enum: ['NEW', 'CONTACTED', 'QUOTATION_SENT', 'DEMO_SCHEDULED', 'CONVERTED', 'LOST'], default: 'NEW' },
  followUps: [followUpSchema],
  quotations: [quotationSchema]
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
