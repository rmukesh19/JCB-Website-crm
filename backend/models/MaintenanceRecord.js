import mongoose from 'mongoose';

const maintenanceRecordSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  branchId: { type: Number, default: 1 },
  machineId: { type: Number, required: true },
  serviceType: { type: String, default: '' },
  serviceDate: { type: String },
  currentHours: { type: Number, default: 0 },
  cost: { type: Number, required: true },
  description: { type: String },
  technicianName: { type: String },
  sparePartsUsed: { type: String },
  nextDueHours: { type: Number }
}, { timestamps: true });

export default mongoose.models.MaintenanceRecord || mongoose.model('MaintenanceRecord', maintenanceRecordSchema);
