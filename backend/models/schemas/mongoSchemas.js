/**
 * Enterprise MongoDB / Mongoose Schemas with Performance Indexing
 * 
 * Provides production-ready schemas, compound indexing, and query optimizations
 * for JCB360 Enterprise ERP.
 */

import mongoose from 'mongoose';

const { Schema } = mongoose;

/**
 * 1. CRM Leads Schema
 * Optimized for high-speed multi-tenant pipeline filtering, phone deduplication, and stage queries
 */
export const CrmLeadSchema = new Schema({
  id: { type: Number, index: true },
  companyId: { type: Number, required: true },
  customerName: { type: String, required: true, trim: true },
  companyName: { type: String, default: '', trim: true },
  customerType: { type: String, default: 'Contractor', index: true },
  businessType: { type: String, default: 'Contractor' },
  mobileNumber: { type: String, required: true, trim: true },
  phone: { type: String, default: '', trim: true },
  whatsAppNumber: { type: String, default: '', trim: true },
  email: { type: String, default: '', lowercase: true, trim: true },
  district: { type: String, default: '', index: true },
  area: { type: String, default: '' },
  address: { type: String, default: '' },
  interestedMachine: { type: String, default: 'JCB 3DX Super Eco' },
  rentalRequirement: { type: String, default: 'Hourly' },
  budget: { type: String, default: '' },
  leadSource: { type: String, default: 'Website', index: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM', index: true },
  status: { type: String, enum: ['NEW', 'CONTACTED', 'FOLLOW_UP', 'INTERESTED', 'NEGOTIATION', 'QUOTATION_SENT', 'CONVERTED', 'LOST', 'HOLD'], default: 'NEW', index: true },
  marketingExecutive: { type: String, default: 'Admin', index: true },
  followUps: [{
    id: Number,
    followUpDate: String,
    followUpTime: String,
    followUpType: String,
    discussionNotes: String,
    nextFollowUpDate: String,
    nextFollowUpTime: String,
    customerResponse: String,
    status: { type: String, default: 'PENDING' }
  }],
  quotations: [{
    id: Number,
    date: String,
    taxRate: Number,
    totalAmount: Number,
    status: String,
    terms: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound Indexes for fast dashboard and CRM pipeline queries:
CrmLeadSchema.index({ companyId: 1, status: 1 });
CrmLeadSchema.index({ companyId: 1, customerType: 1 });
CrmLeadSchema.index({ companyId: 1, marketingExecutive: 1 });
CrmLeadSchema.index({ mobileNumber: 1 }); // deduplication lookup
CrmLeadSchema.index({ createdAt: -1 });

/**
 * 2. Bookings Schema
 * Optimized for schedule overlap detection, fleet tracking, and customer billing
 */
export const BookingSchema = new Schema({
  id: { type: Number, index: true },
  companyId: { type: Number, required: true, index: true },
  bookingNumber: { type: String, required: true, unique: true },
  customerId: { type: Number, required: true, index: true },
  customerName: { type: String, required: true },
  machineId: { type: Number, required: true, index: true },
  machineName: { type: String, required: true },
  operatorId: { type: Number, index: true },
  operatorName: { type: String, default: '' },
  startDate: { type: String, required: true, index: true },
  endDate: { type: String, default: '' },
  status: { type: String, enum: ['CONFIRMED', 'RUNNING', 'COMPLETED', 'CANCELLED'], default: 'CONFIRMED', index: true },
  rentalType: { type: String, enum: ['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY'], default: 'HOURLY' },
  rate: { type: Number, default: 0 },
  withDiesel: { type: Boolean, default: false },
  siteLocation: { type: String, default: '' },
  totalHours: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 }
}, {
  timestamps: true
});

BookingSchema.index({ companyId: 1, status: 1, startDate: -1 });
BookingSchema.index({ machineId: 1, status: 1 });
BookingSchema.index({ customerId: 1, status: 1 });

/**
 * 3. Invoices Schema
 * Optimized for accounts reconciliation, GST filing, and customer payment tracking
 */
export const InvoiceSchema = new Schema({
  id: { type: Number, index: true },
  companyId: { type: Number, required: true, index: true },
  invoiceNumber: { type: String, required: true, unique: true },
  bookingId: { type: Number, index: true },
  customerId: { type: Number, required: true, index: true },
  customerName: { type: String, required: true },
  customerGstin: { type: String, default: '' },
  date: { type: String, required: true, index: true },
  dueDate: { type: String, default: '' },
  items: [{
    description: String,
    hsnCode: String,
    quantity: Number,
    rate: Number,
    amount: Number
  }],
  subtotal: { type: Number, default: 0 },
  cgst: { type: Number, default: 0 },
  sgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['DRAFT', 'ISSUED', 'PARTIAL', 'PAID', 'OVERDUE'], default: 'ISSUED', index: true }
}, {
  timestamps: true
});

InvoiceSchema.index({ companyId: 1, status: 1 });
InvoiceSchema.index({ companyId: 1, date: -1 });
InvoiceSchema.index({ customerId: 1, status: 1 });

/**
 * 4. Site Logs Schema
 * Optimized for machine hour logging and daily shift analytics
 */
export const SiteLogSchema = new Schema({
  id: { type: Number, index: true },
  companyId: { type: Number, required: true, index: true },
  bookingId: { type: Number, index: true },
  machineId: { type: Number, required: true, index: true },
  date: { type: String, required: true, index: true },
  startHourMeter: { type: Number, required: true },
  endHourMeter: { type: Number, required: true },
  totalHours: { type: Number, required: true },
  dieselIssuedLiters: { type: Number, default: 0 },
  operatorId: { type: Number, index: true },
  customerSign: { type: String, default: '' }
}, {
  timestamps: true
});

SiteLogSchema.index({ companyId: 1, machineId: 1, date: -1 });
SiteLogSchema.index({ bookingId: 1, date: -1 });

/**
 * 5. Machines Schema
 */
export const MachineSchema = new Schema({
  id: { type: Number, index: true },
  companyId: { type: Number, required: true, index: true },
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  modelName: { type: String, required: true },
  type: { type: String, default: 'Backhoe Loader' },
  regNumber: { type: String, required: true, index: true },
  status: { type: String, enum: ['AVAILABLE', 'RUNNING', 'MAINTENANCE', 'IDLE'], default: 'AVAILABLE', index: true },
  currentHours: { type: Number, default: 0 },
  nextServiceDueHours: { type: Number, default: 250 }
}, {
  timestamps: true
});

MachineSchema.index({ companyId: 1, status: 1 });

/**
 * Query Helper: Applies `.lean()` and pagination defaults automatically
 */
export const applyLeanPagination = (query, { page = 1, limit = 50, sort = { createdAt: -1 } } = {}) => {
  const p = Math.max(1, parseInt(page, 10));
  const l = Math.min(200, Math.max(1, parseInt(limit, 10)));
  const skip = (p - 1) * l;

  return query
    .lean({ virtuals: true })
    .sort(sort)
    .skip(skip)
    .limit(l);
};
