import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, default: 'INFO' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
