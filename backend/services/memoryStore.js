import mongoose from 'mongoose';

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const memoryStore = {
  machines: [
    { id: 1, name: 'JCB 3DX Super Backhoe Loader', modelName: 'JCB 3DX Super', plateNumber: 'TN-01-AB-1234', serialNumber: 'JCB3DX-88902', purchaseDate: '2023-01-15', currentHours: 1250, hourlyRate: 1500, dailyRate: 12000, status: 'RUNNING', lastServiceDate: '2026-05-10', nextServiceDueHours: 1500 },
    { id: 2, name: 'JCB JS205 Excavator 20 Ton', modelName: 'JCB JS205', plateNumber: 'TN-09-CD-5678', serialNumber: 'JS205-11029', purchaseDate: '2022-08-20', currentHours: 2400, hourlyRate: 2800, dailyRate: 22000, status: 'AVAILABLE', lastServiceDate: '2026-06-01', nextServiceDueHours: 2500 },
    { id: 3, name: 'JCB 432ZX Wheel Loader', modelName: 'JCB 432ZX', plateNumber: 'TN-22-EF-9012', serialNumber: 'WL432-33410', purchaseDate: '2024-03-10', currentHours: 620, hourlyRate: 2200, dailyRate: 18000, status: 'AVAILABLE', lastServiceDate: '2026-04-15', nextServiceDueHours: 750 },
    { id: 4, name: 'JCB VM117 Compactor Roller', modelName: 'JCB VM117', plateNumber: 'TN-14-GH-3456', serialNumber: 'VM117-09821', purchaseDate: '2023-11-05', currentHours: 980, hourlyRate: 1600, dailyRate: 13000, status: 'MAINTENANCE', lastServiceDate: '2026-07-01', nextServiceDueHours: 1000 }
  ],

  customers: [
    { id: 1, name: 'Srinivasan Infrastructure Ltd', companyName: 'Srinivasan Infra', mobile: '9840123456', whatsApp: '9840123456', email: 'contact@srinivasaninfra.com', address: 'GST Road, Tambaram, Chennai', district: 'Chennai', gstin: '33AAAAA0000A1Z5', creditLimit: 500000, outstandingBalance: 45000, status: 'ACTIVE' },
    { id: 2, name: 'Karthik Earthmovers & Builders', companyName: 'Karthik Builders', mobile: '9840234567', whatsApp: '9840234567', email: 'karthik@earthmovers.in', address: 'Bypass Road, Madurai', district: 'Madurai', gstin: '33BBBBB1111B1Z2', creditLimit: 300000, outstandingBalance: 12000, status: 'ACTIVE' },
    { id: 3, name: 'Metro Rail Corridor Construction', companyName: 'Metro Corridor Ltd', mobile: '9840345678', whatsApp: '9840345678', email: 'procurement@metrorailcorp.org', address: 'OMR Tech Park, Perungudi, Chennai', district: 'Chennai', gstin: '33CCCCC2222C1Z9', creditLimit: 1000000, outstandingBalance: 180000, status: 'ACTIVE' }
  ],

  leads: [
    { id: 1, customerName: 'Rajesh Contractor', companyName: 'Rajesh Constructions', mobileNumber: '9876543210', whatsAppNumber: '9876543210', email: 'rajesh@constructions.com', address: 'Anna Nagar, Chennai', district: 'Chennai', businessType: 'Contractor', customerType: 'Contractor', interestedMachine: 'JCB 3DX Super', rentalRequirement: 'Monthly Contract (150 Hours)', leadSource: 'WhatsApp Inbound', marketingExecutive: 'Ananth Krishnan', priority: 'HIGH', expectedBookingDate: '2026-08-05', remarks: 'Requires machine at Porur bypass site', status: 'NEW', followUps: [], quotations: [] },
    { id: 2, customerName: 'Venkatesh Builders', companyName: 'Venkatesh Housing', mobileNumber: '9876543211', whatsAppNumber: '9876543211', email: 'venkat@housing.com', address: 'Trichy Main Road, Coimbatore', district: 'Coimbatore', businessType: 'Real Estate Developer', customerType: 'Real Estate Developer', interestedMachine: 'JCB JS205 Excavator', rentalRequirement: '15 Days Demo & Rental', leadSource: 'Google Search', marketingExecutive: 'Suresh Kumar', priority: 'MEDIUM', expectedBookingDate: '2026-08-10', remarks: 'Quotation sent via WhatsApp', status: 'QUOTATION_SENT', followUps: [{ id: 1, date: '2026-07-28', followUpType: 'PHONE_CALL', remarks: 'Discussed hourly rates and operator accommodation', nextFollowUpDate: '2026-08-01', executiveName: 'Suresh Kumar' }], quotations: [{ id: 1, quotationNumber: 'QTN-2026-001', date: '2026-07-28', machineModel: 'JCB JS205 Excavator', billingType: 'HOURLY', rate: 2800, subtotal: 84000, taxAmount: 15120, grandTotal: 99120, status: 'SENT' }] }
  ],

  bookings: [
    { id: 1, companyId: 1, branchId: 1, customerId: 1, machineId: 1, operatorId: 1, driverId: 1, siteLocation: 'Metro Station Construction Site, Koyambedu, Chennai', billingType: 'HOURLY', billingRate: 1500, startHours: 1200, endHours: 1250, startDate: '2026-07-25', endDate: '', status: 'ACTIVE', advanceAmount: 10000 }
  ],

  invoices: [
    { id: 1, companyId: 1, branchId: 1, bookingId: 1, customerId: 1, invoiceNumber: 'INV-2026-0001', invoiceDate: '2026-07-26', dueDate: '2026-08-10', subtotal: 75000, cgstRate: 9, sgstRate: 9, igstRate: 0, cgstAmount: 6750, sgstAmount: 6750, igstAmount: 0, totalTax: 13500, grandTotal: 88500, paidAmount: 43500, outstandingAmount: 45000, status: 'PARTIALLY_PAID', qrCodeData: 'UPI://PAY?PA=JCB360@BANK' }
  ],

  accounts: [
    { id: 1, name: 'HDFC Bank Main Operating A/C', code: '1001', type: 'ASSET', balance: 1450000, openingBalance: 1000000, gstApplicable: 'NO', status: 'ACTIVE', group: 'Bank Accounts' },
    { id: 2, name: 'Cash in Hand', code: '1002', type: 'ASSET', balance: 85000, openingBalance: 50000, gstApplicable: 'NO', status: 'ACTIVE', group: 'Cash' },
    { id: 3, name: 'Equipment Rental Revenue', code: '4001', type: 'REVENUE', balance: 885000, openingBalance: 0, gstApplicable: 'YES', status: 'ACTIVE', group: 'Income' },
    { id: 4, name: 'Diesel & Fuel Expenses', code: '5001', type: 'EXPENSE', balance: 210000, openingBalance: 0, gstApplicable: 'NO', status: 'ACTIVE', group: 'Operating Expenses' },
    { id: 5, name: 'Operator Wages & Salaries', code: '5002', type: 'EXPENSE', balance: 140000, openingBalance: 0, gstApplicable: 'NO', status: 'ACTIVE', group: 'Payroll' }
  ],

  transactions: [
    { id: 1, companyId: 1, branchId: 1, transactionDate: '2026-07-26', referenceNumber: 'INV-2026-0001', description: 'Equipment rental billing for Srinivasan Infra', type: 'RECEIPT', lines: [{ accountId: 1, debit: 43500, credit: 0 }, { accountId: 3, debit: 0, credit: 43500 }] }
  ],

  expenses: [
    { id: 1, companyId: 1, branchId: 1, category: 'Machine Maintenance', amount: 18500, paymentMode: 'BANK', expenseDate: '2026-07-20', description: 'Hydraulic oil filter replacement JCB 3DX', recipient: 'TVS Auto Services', approvedBy: 'Ananth Krishnan' },
    { id: 2, companyId: 1, branchId: 1, category: 'Site Transport', amount: 6500, paymentMode: 'CASH', expenseDate: '2026-07-22', description: 'Trailer transport for JCB JS205 to Madurai site', recipient: 'Sri Ram Transports', approvedBy: 'Ananth Krishnan' }
  ],

  employees: [
    { id: 1, name: 'Ramasamy Operator', role: 'Senior Operator', department: 'Operations', designation: 'JCB Backhoe Operator', phone: '9789012345', email: 'ramasamy@jcb360infra.com', basicSalary: 28000, joinDate: '2022-03-01', status: 'ACTIVE' },
    { id: 2, name: 'Murugan Driver', role: 'Heavy Vehicle Driver', department: 'Logistics', designation: 'Trailer Driver', phone: '9789023456', email: 'murugan@jcb360infra.com', basicSalary: 24000, joinDate: '2023-01-15', status: 'ACTIVE' },
    { id: 3, name: 'Suresh Kumar', role: 'Marketing Executive', department: 'Sales & CRM', designation: 'Senior Executive', phone: '9789034567', email: 'suresh@jcb360infra.com', basicSalary: 32000, joinDate: '2021-06-10', status: 'ACTIVE' }
  ],

  attendance: [
    { id: 1, employeeId: 1, date: '2026-07-29', status: 'PRESENT', checkIn: '08:30 AM', checkOut: '06:00 PM', shift: 'DAY' },
    { id: 2, employeeId: 2, date: '2026-07-29', status: 'PRESENT', checkIn: '08:45 AM', checkOut: '06:15 PM', shift: 'DAY' }
  ],

  salarySlips: [
    { id: 1, employeeId: 1, month: 'July', year: 2026, basicPay: 28000, allowances: 3000, deductions: 1500, netSalary: 29500, status: 'GENERATED' }
  ],

  dieselRecords: [
    { id: 1, machineId: 1, fillDate: '2026-07-24', currentHours: 1210, quantityLiters: 120, ratePerLiter: 92.5, totalCost: 11100, vendorName: 'Indian Oil Bunk Koyambedu', slipNumber: 'IOC-88201', paymentMode: 'BANK' }
  ],

  maintenanceRecords: [
    { id: 1, machineId: 1, serviceType: '250 HR Scheduled Service', serviceDate: '2026-05-10', currentHours: 1000, cost: 14500, description: 'Engine oil filter, fuel filters replaced, grease nipples serviced', technicianName: 'JCB Authorized Technician', sparePartsUsed: 'Engine Oil 15L, Oil Filter 3DX', nextDueHours: 1250 }
  ],

  whatsAppTemplates: [
    { id: 1, name: 'Booking Confirmation', type: 'Transactional', body: 'Dear {{1}}, your JCB rental booking for {{2}} is confirmed. Booking Ref: {{3}}. Total Rate: Rs. {{4}}. Thank you for choosing MMT Enterprises.' },
    { id: 2, name: 'Payment Reminder', type: 'Transactional', body: 'Dear {{1}}, reminder for outstanding invoice {{2}} amount Rs. {{3}}. Kindly arrange payment at your earliest.' }
  ],

  whatsAppCampaigns: [
    { id: 1, campaignName: 'Monsoon Earthmoving Offers', templateId: 1, targetAudience: 'All Contractors', status: 'COMPLETED', sentCount: 142, failedCount: 3, scheduledAt: '2026-07-15' }
  ],

  companies: [
    { id: 1, name: 'MMT ENTERPRISES', logo: '/assets/logo.png', gstin: '33AAACM1234F1Z0', pan: 'AAACM1234F', email: 'admin@jcb360infra.com', phone: '044-24508899', address: 'No. 42, Heavy Equipment Zone, Guindy Industrial Estate, Chennai - 600032', website: 'https://jcb360infra.com', invoiceFooter: 'Thank you for your business! Bank: HDFC Bank A/C: 50200012345678 IFSC: HDFC0001234', qrCode: 'UPI://PAY?PA=JCB360@BANK', bankDetails: 'HDFC Bank, Guindy Branch, A/C: 50200012345678, IFSC: HDFC0001234' }
  ],

  branches: [
    { id: 1, companyId: 1, name: 'Chennai Central HQ', code: 'CHE-01', phone: '044-24508899', address: 'Guindy Industrial Estate, Chennai' },
    { id: 2, companyId: 1, name: 'Madurai Southern Hub', code: 'MDU-02', phone: '0452-2345678', address: 'Bypass Road, Madurai' }
  ],

  users: [
    { id: 1, companyId: 1, branchId: 1, name: 'Ananth Krishnan', username: 'admin', email: 'ananth@jcb360infra.com', role: 'ADMIN', isActive: true, loginAllowedFrom: '09:00 AM', loginAllowedTo: '06:00 PM', loginTimeRestrictionEnabled: false }
  ],

  auditLogs: [
    { id: 1, companyId: 1, userId: 1, userName: 'Ananth Krishnan', action: 'SYSTEM_BOOT', details: 'JCB360 Enterprise ERP Backend started successfully', ipAddress: '127.0.0.1', createdAt: new Date() }
  ],

  operators: [
    { id: 1, companyId: 1, branchId: 1, name: 'Ramasamy Operator', phone: '9789012345', role: 'Senior Operator', status: 'AVAILABLE' }
  ],

  drivers: [
    { id: 1, companyId: 1, branchId: 1, name: 'Murugan Driver', phone: '9789023456', role: 'Heavy Vehicle Driver', status: 'AVAILABLE' }
  ],

  spareParts: [
    { id: 1, name: 'Engine Oil Filter JCB 3DX', partNumber: 'JCB-320/04133', category: 'Filters', quantity: 24, unitPrice: 850, minStockLevel: 5 }
  ],

  suppliers: [
    { id: 1, name: 'TVS Auto Spares Ltd', contactPerson: 'Rajendran', phone: '9840998877', address: 'Mount Road, Chennai', gstin: '33TVSAP1234F1Z9' }
  ],

  purchases: [
    { id: 1, supplierId: 1, invoiceNumber: 'PUR-8801', purchaseDate: '2026-07-20', totalAmount: 18500, status: 'PAID' }
  ],

  notifications: [
    { id: 1, title: 'System initialized', message: 'Welcome to JCB360 Enterprise ERP', isRead: false, createdAt: new Date() }
  ]
};

export default memoryStore;
