import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  branchId: { type: Number, default: 1 },
  customerId: { type: Number, required: true },
  machineId: { type: Number, required: true },
  operatorId: { type: Number },
  driverId: { type: Number },
  siteLocation: { type: String },
  billingType: { type: String, enum: ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'CONTRACT'], default: 'HOURLY' },
  billingRate: { type: Number, default: 0 },
  startHours: { type: Number, default: 0 },
  endHours: { type: Number, default: 0 },
  startDate: { type: String },
  endDate: { type: String },
  status: { type: String, enum: ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },
  advanceAmount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
