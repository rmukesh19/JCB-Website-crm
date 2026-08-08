import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  name: { type: String, required: true },
  code: { type: String },
  phone: { type: String },
  address: { type: String }
}, { timestamps: true });

export default mongoose.models.Branch || mongoose.model('Branch', branchSchema);
