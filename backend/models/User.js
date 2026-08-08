import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  branchId: { type: Number, default: 1 },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'MANAGER', 'EXECUTIVE', 'OPERATOR', 'ACCOUNTANT'], default: 'ADMIN' },
  isActive: { type: Boolean, default: true },
  loginAllowedFrom: { type: String, default: '09:00 AM' },
  loginAllowedTo: { type: String, default: '06:00 PM' },
  loginTimeRestrictionEnabled: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
