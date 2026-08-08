import mongoose from 'mongoose';

const salarySlipSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  employeeId: { type: Number, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  basicPay: { type: Number, required: true },
  allowances: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netSalary: { type: Number, required: true },
  status: { type: String, enum: ['DRAFT', 'GENERATED', 'PAID'], default: 'GENERATED' }
}, { timestamps: true });

export default mongoose.models.SalarySlip || mongoose.model('SalarySlip', salarySlipSchema);
