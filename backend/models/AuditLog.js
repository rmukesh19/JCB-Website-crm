import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  userId: { type: Number },
  userName: { type: String },
  action: { type: String, required: true },
  details: { type: String },
  ipAddress: { type: String, default: '127.0.0.1' }
}, { timestamps: true });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
