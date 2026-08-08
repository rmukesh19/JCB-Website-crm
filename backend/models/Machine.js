import mongoose from 'mongoose';

const machineSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  branchId: { type: Number, default: 1 },
  name: { type: String, default: 'JCB Machine' },
  modelName: { type: String },
  plateNumber: { type: String, required: true },
  serialNumber: { type: String },
  purchaseDate: { type: String },
  currentHours: { type: Number, default: 0 },
  hourlyRate: { type: Number, default: 0 },
  dailyRate: { type: Number, default: 0 },
  status: { type: String, enum: ['AVAILABLE', 'RUNNING', 'MAINTENANCE', 'RESERVED'], default: 'AVAILABLE' },
  lastServiceDate: { type: String },
  nextServiceDueHours: { type: Number, default: 250 }
}, { timestamps: true });

export default mongoose.models.Machine || mongoose.model('Machine', machineSchema);
