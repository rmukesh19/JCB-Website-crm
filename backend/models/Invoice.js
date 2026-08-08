import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  branchId: { type: Number, default: 1 },
  bookingId: { type: Number },
  customerId: { type: Number, required: true },
  invoiceNumber: { type: String, required: true },
  invoiceDate: { type: String, required: true },
  dueDate: { type: String },
  subtotal: { type: Number, required: true },
  cgstRate: { type: Number, default: 9 },
  sgstRate: { type: Number, default: 9 },
  igstRate: { type: Number, default: 0 },
  cgstAmount: { type: Number, default: 0 },
  sgstAmount: { type: Number, default: 0 },
  igstAmount: { type: Number, default: 0 },
  totalTax: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  outstandingAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['UNPAID', 'PARTIALLY_PAID', 'PAID', 'CANCELLED'], default: 'UNPAID' },
  qrCodeData: { type: String }
}, { timestamps: true });

export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
