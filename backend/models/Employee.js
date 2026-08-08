import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  branchId: { type: Number, default: 1 },
  name: { type: String, required: true },
  role: { type: String, default: 'Operator' },
  department: { type: String, default: 'Operations' },
  designation: { type: String },
  phone: { type: String },
  email: { type: String },
  basicSalary: { type: Number, default: 25000 },
  joinDate: { type: String },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'], default: 'ACTIVE' }
}, { timestamps: true });

export default mongoose.models.Employee || mongoose.model('Employee', employeeSchema);
