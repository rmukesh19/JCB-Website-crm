import mongoose from 'mongoose';

const dieselRecordSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  branchId: { type: Number, default: 1 },
  machineId: { type: Number, required: true },
  fillDate: { type: String },
  currentHours: { type: Number, default: 0 },
  quantityLiters: { type: Number, default: 0 },
  ratePerLiter: { type: Number, default: 0 },
  totalCost: { type: Number, required: true },
  vendorName: { type: String },
  slipNumber: { type: String },
  paymentMode: { type: String, default: 'BANK' }
}, { timestamps: true });

export default mongoose.models.DieselRecord || mongoose.model('DieselRecord', dieselRecordSchema);
