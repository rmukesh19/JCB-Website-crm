import mongoose from 'mongoose';

const transactionLineSchema = new mongoose.Schema({
  accountId: { type: Number, required: true },
  debit: { type: Number, default: 0 },
  credit: { type: Number, default: 0 }
});

const transactionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  branchId: { type: Number, default: 1 },
  transactionDate: { type: String, required: true },
  referenceNumber: { type: String },
  description: { type: String },
  type: { type: String, enum: ['JOURNAL', 'RECEIPT', 'PAYMENT', 'CONTRA'], default: 'JOURNAL' },
  lines: [transactionLineSchema]
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
