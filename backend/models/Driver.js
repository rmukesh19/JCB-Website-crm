import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  branchId: { type: Number, default: 1 },
  name: { type: String, required: true },
  mobile: { type: String },
  licenseNumber: { type: String },
  dailyWages: { type: Number, default: 0 },
  status: { type: String, enum: ['AVAILABLE', 'ON_DUTY', 'LEAVE'], default: 'AVAILABLE' }
}, { timestamps: true });

export default mongoose.models.Driver || mongoose.model('Driver', driverSchema);
