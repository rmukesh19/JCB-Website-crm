import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  branchId: { type: Number, default: 1 },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMode: { type: String, default: 'BANK' },
  expenseDate: { type: String },
  description: { type: String },
  recipient: { type: String },
  approvedBy: { type: String }
}, { timestamps: true });

export default mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
