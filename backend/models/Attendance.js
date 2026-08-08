import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  companyId: { type: Number, default: 1 },
  employeeId: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE'], default: 'PRESENT' },
  checkIn: { type: String },
  checkOut: { type: String },
  shift: { type: String, default: 'DAY' }
}, { timestamps: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
