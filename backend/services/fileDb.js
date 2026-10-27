import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('[FileDB] Error creating data directory:', err);
  }
}

export const getInitialData = () => ({
  companies: [
    {
      id: 1,
      name: "MMT ENTERPRISES",
      tagline: "Heavy Equipment, Fleet Management & Billing",
      gstin: "",
      pan: "",
      mobile: "",
      phone: "",
      email: "contact@jcb360.in",
      address: "",
      state: "Tamil Nadu",
      stateCode: "33",
      currency: "INR",
      currencySymbol: "₹",
      financialYearStart: "2025-04-01",
      bankName: "",
      bankBranch: "",
      accountNumber: "",
      ifscCode: ""
    }
  ],
  branches: [
    { id: 1, companyId: 1, name: "Coimbatore Main Yard & Workshop", code: "CBE-01", address: "Avinashi Road, Coimbatore, Tamil Nadu - 641001", phone: "+91 98421 23456", isHeadOffice: true }
  ],
  users: [
    { id: 1, companyId: 1, branchId: 1, username: "admin", password: "password123", name: "System Administrator", role: "ADMIN", email: "admin@srimuruganfleet.in", phone: "9842123456", active: true },
    { id: 2, companyId: 1, branchId: 1, username: "manager", password: "password123", name: "R. Shanmugam", role: "MANAGER", email: "shanmugam@srimuruganfleet.in", phone: "9842177654", active: true },
    { id: 3, companyId: 1, branchId: 1, username: "accounts", password: "password123", name: "K. Malathi", role: "ACCOUNTS", email: "malathi.acc@srimuruganfleet.in", phone: "9842199882", active: true },
    { id: 4, companyId: 1, branchId: 1, username: "operator", password: "password123", name: "P. Murugan", role: "OPERATOR", email: "murugan@srimuruganfleet.in", phone: "9789011223", active: true }
  ],
  machines: [
    { id: 1, companyId: 1, branchId: 1, code: "JCB-3DX-01", name: "JCB 3DX Super Eco", modelName: "JCB 3DX Super Eco", type: "Backhoe Loader", regNumber: "TN-30-BD-4492", plateNumber: "TN-30-BD-4492", chasisNumber: "HAR3DX981249", chassisNumber: "HAR3DX981249", engineNumber: "ENG3DX8812", yom: 2022, currentMeterReading: 3840, currentHours: 3840, nextServiceDueHours: 250, ownership: "OWNED", defaultRatePerHour: 1400, hourlyRate: 1400, dailyRate: 10500, weeklyRate: 65000, monthlyRate: 250000, defaultRateWithDiesel: 1900, status: "AVAILABLE", assignedOperatorId: 1 },
    { id: 2, companyId: 1, branchId: 1, code: "HITACHI-EX200", name: "Tata Hitachi EX200 LC", modelName: "Tata Hitachi EX200 LC", type: "Heavy Excavator", regNumber: "TN-30-CA-8819", plateNumber: "TN-30-CA-8819", chasisNumber: "THEX200984128", chassisNumber: "THEX200984128", engineNumber: "ENGEX200941", yom: 2021, currentMeterReading: 5120, currentHours: 5120, nextServiceDueHours: 150, ownership: "OWNED", defaultRatePerHour: 2800, hourlyRate: 2800, dailyRate: 21000, weeklyRate: 130000, monthlyRate: 500000, defaultRateWithDiesel: 3800, status: "RUNNING", assignedOperatorId: 2 },
    { id: 3, companyId: 1, branchId: 1, code: "CAT-424B", name: "Caterpillar 424B2", modelName: "Caterpillar 424B2", type: "Backhoe Loader", regNumber: "TN-54-E-1902", plateNumber: "TN-54-E-1902", chasisNumber: "CAT424B889211", chassisNumber: "CAT424B889211", engineNumber: "ENGCAT424B12", yom: 2023, currentMeterReading: 1940, currentHours: 1940, nextServiceDueHours: 40, ownership: "OWNED", defaultRatePerHour: 1500, hourlyRate: 1500, dailyRate: 11500, weeklyRate: 70000, monthlyRate: 270000, defaultRateWithDiesel: 2050, status: "MAINTENANCE", assignedOperatorId: 3 }
  ],
  customers: [
    { id: 1, companyId: 1, name: "KNR Constructions Salem Bypass Project", company: "KNR Constructions", customerType: "Contractor", contactPerson: "Er. Vigneshwaran", mobile: "+91 94432 10982", phone: "+91 94432 10982", email: "vignesh@knrconstructions.com", gstin: "33AAACK4492F1Z4", billingAddress: "Camp Office, Omalur Flyover Site, Salem - 636005", currentBalance: 56818, outstanding: 56818, creditLimit: 200000, status: "ACTIVE" },
    { id: 2, companyId: 1, name: "Sri Balaji Brick & Tiles Kiln", company: "Sri Balaji Brick & Tiles Kiln", customerType: "Builder", contactPerson: "Thiru. S. Arumugam", mobile: "+91 98941 66521", phone: "+91 98941 66521", email: "balajibricks@gmail.com", gstin: "33AABFA9012A1Z9", billingAddress: "Mecheri Road, Mettur Taluk, Salem - 636453", currentBalance: 32000, outstanding: 32000, creditLimit: 100000, status: "ACTIVE" },
    { id: 3, companyId: 1, name: "GK Farm Lands & Coconut Agro", company: "GK Farm Lands & Coconut Agro", customerType: "Individual / Home Owner", contactPerson: "P. Govindarajan", mobile: "+91 97881 23410", phone: "+91 97881 23410", email: "gkfarms.agro@gmail.com", gstin: "", billingAddress: "Namagiripettai, Rasipuram - 637406", currentBalance: 0, outstanding: 0, creditLimit: 50000, status: "ACTIVE" }
  ],
  bookings: [
    { id: 1, bookingNumber: "BKG-2026-0089", companyId: 1, branchId: 1, customerId: 1, customerName: "KNR Constructions Salem Bypass Project", machineId: 1, machineName: "JCB 3DX Super Eco (TN 30 BD 4492)", operatorId: 1, operatorName: "P. Murugan", siteLocation: "Omalur Bypass Package 2, Salem", workType: "Trenching & Earth Leveling", ratePerHour: 1400, fuelIncluded: false, startDate: "2026-03-01", status: "IN_PROGRESS", totalHours: 46.5, totalAmount: 65100, advanceReceived: 20000, balanceDue: 45100 },
    { id: 2, bookingNumber: "BKG-2026-0090", companyId: 1, branchId: 1, customerId: 2, customerName: "Sri Balaji Brick & Tiles Kiln", machineId: 2, machineName: "Tata Hitachi EX200 LC (TN 30 CA 8819)", operatorId: 2, operatorName: "S. Kaliappan", siteLocation: "Mettur Red Clay Quarry", workType: "Heavy Excavation & Loading", ratePerHour: 2800, fuelIncluded: false, startDate: "2026-03-03", status: "COMPLETED", totalHours: 24, totalAmount: 67200, advanceReceived: 35000, balanceDue: 32200 }
  ],
  invoices: [
    { id: 1, invoiceNumber: "INV-2026-0042", companyId: 1, branchId: 1, customerId: 1, customerName: "KNR Constructions Salem Bypass Project", date: "2026-03-01", invoiceDate: "2026-03-01", subtotal: 65100, subTotal: 65100, gstRate: 18, gstAmount: 11718, grandTotal: 76818, totalAmount: 76818, paidAmount: 20000, receivedAmount: 20000, outstandingAmount: 56818, balanceAmount: 56818, status: "PARTIAL" }
  ],
  expenses: [
    { id: 1, companyId: 1, branchId: 1, machineId: 1, category: "DIESEL", amount: 18400, description: "200 Litres Bulk Tanker Delivery (Indian Oil)", date: "2026-03-02", vendor: "IOCL Swarnapuri Fuel Station" },
    { id: 2, companyId: 1, branchId: 1, machineId: 3, category: "SPARE_PARTS", amount: 9800, description: "Hydraulic Seal Kit replacement & O-rings", date: "2026-03-03", vendor: "Salem JCB Spares & Services" },
    { id: 3, companyId: 1, branchId: 1, machineId: null, category: "SALARY", amount: 35000, description: "Monthly operator advance payout", date: "2026-03-01", vendor: "Staff Payroll" }
  ],
  dieselRecords: [
    { id: 1, companyId: 1, branchId: 1, machineId: 1, machineCode: "JCB-3DX-01", date: "2026-03-02", fillDate: "2026-03-02T10:30:00.000Z", quantityLiters: 120, ratePerLiter: 92.5, totalCost: 11100, totalAmount: 11100, currentHours: 3820, meterReading: 3820, vendor: "IOCL Salem", vendorName: "IOCL Salem", slipNumber: "SLIP-38291", paymentMode: "BANK", filledBy: "P. Murugan", operatorId: 1 },
    { id: 2, companyId: 1, branchId: 1, machineId: 2, machineCode: "HITACHI-EX200", date: "2026-03-03", fillDate: "2026-03-03T14:15:00.000Z", quantityLiters: 250, ratePerLiter: 92.5, totalCost: 23125, totalAmount: 23125, currentHours: 5110, meterReading: 5110, vendor: "BPCL Bypass Salem", vendorName: "BPCL Bypass Salem", slipNumber: "SLIP-51920", paymentMode: "BANK", filledBy: "S. Kaliappan", operatorId: 2 }
  ],
  maintenanceRecords: [
    { id: 1, companyId: 1, branchId: 1, machineId: 3, machineCode: "CAT-424B", serviceDate: "2026-03-03", serviceType: "HYDRAULIC_SYSTEM", description: "Replaced boom cylinder seal kit and hydraulic filter", cost: 14500, serviceCenter: "Caterpillar Authorised Depot, Salem", nextServiceHours: 2500, status: "COMPLETED" }
  ],
  employees: [
    { id: 1, companyId: 1, branchId: 1, name: "P. Murugan", role: "OPERATOR", phone: "+91 97890 11223", salary: 28000, joiningDate: "2021-04-10", status: "ACTIVE" },
    { id: 2, companyId: 1, branchId: 1, name: "S. Kaliappan", role: "OPERATOR", phone: "+91 98421 44556", salary: 32000, joiningDate: "2020-02-15", status: "ACTIVE" },
    { id: 3, companyId: 1, branchId: 1, name: "M. Saravanan", role: "DRIVER", phone: "+91 94432 77889", salary: 24000, joiningDate: "2022-08-01", status: "ACTIVE" }
  ],
  attendance: [
    { id: 1, companyId: 1, branchId: 1, employeeId: 1, date: "2026-03-04", status: "PRESENT", checkIn: "08:00 AM", checkOut: "06:30 PM", overTimeHours: 1.5 },
    { id: 2, companyId: 1, branchId: 1, employeeId: 2, date: "2026-03-04", status: "PRESENT", checkIn: "07:30 AM", checkOut: "07:00 PM", overTimeHours: 2.5 },
    { id: 3, companyId: 1, branchId: 1, employeeId: 3, date: "2026-03-04", status: "PRESENT", checkIn: "08:15 AM", checkOut: "06:00 PM", overTimeHours: 1.0 }
  ],
  salarySlips: [
    { id: 1, companyId: 1, branchId: 1, employeeId: 1, employeeName: "P. Murugan", month: "February 2026", basicSalary: 28000, allowances: 4000, deductions: 1000, netSalary: 31000, status: "PAID", paymentDate: "2026-03-01" }
  ],
  leads: [],
  crmLeads: [],
  accounts: [
    { id: 1, companyId: 1, name: "HDFC Current Account (Salem)", type: "BANK", code: "ACC-BANK-01", balance: 642800, gstApplicable: false, status: "ACTIVE" },
    { id: 2, companyId: 1, name: "Yard Petty Cash Drawer", type: "CASH", code: "ACC-CASH-01", balance: 38500, gstApplicable: false, status: "ACTIVE" },
    { id: 3, companyId: 1, name: "Customer Receivables Ledger", type: "ASSET", code: "ACC-AR-01", balance: 116500, gstApplicable: true, status: "ACTIVE" },
    { id: 4, companyId: 1, name: "Vendor Payables Ledger", type: "LIABILITY", code: "ACC-AP-01", balance: 45000, gstApplicable: true, status: "ACTIVE" }
  ],
  transactions: [
    {
      id: 1,
      companyId: 1,
      voucherNumber: "VCH-2026-0128",
      referenceNumber: "VCH-2026-0128",
      date: "2026-03-01",
      transactionDate: "2026-03-01",
      type: "RECEIPT",
      accountId: 1,
      accountName: "HDFC Current Account",
      amount: 20000,
      party: "KNR Constructions",
      particulars: "Advance for Salem Bypass Booking BKG-2026-0089",
      description: "Advance for Salem Bypass Booking BKG-2026-0089",
      paymentMode: "BANK",
      lines: [
        { accountId: 1, debit: 20000, credit: 0 },
        { accountId: 3, debit: 0, credit: 20000 }
      ]
    },
    {
      id: 2,
      companyId: 1,
      voucherNumber: "VCH-2026-0129",
      referenceNumber: "VCH-2026-0129",
      date: "2026-03-02",
      transactionDate: "2026-03-02",
      type: "PAYMENT",
      accountId: 1,
      accountName: "HDFC Current Account",
      amount: 11100,
      party: "IOCL Salem Fuel",
      particulars: "Bulk Diesel purchase 120L for JCB 3DX",
      description: "Bulk Diesel purchase 120L for JCB 3DX",
      paymentMode: "BANK",
      lines: [
        { accountId: 1, debit: 0, credit: 11100 },
        { accountId: 4, debit: 11100, credit: 0 }
      ]
    },
    {
      id: 3,
      companyId: 1,
      voucherNumber: "VCH-2026-0130",
      referenceNumber: "VCH-2026-0130",
      date: "2026-03-03",
      transactionDate: "2026-03-03",
      type: "PAYMENT",
      accountId: 2,
      accountName: "Yard Petty Cash",
      amount: 9800,
      party: "Salem JCB Spares",
      particulars: "Hydraulic seal kit for CAT 424B",
      description: "Hydraulic seal kit for CAT 424B",
      paymentMode: "CASH",
      lines: [
        { accountId: 2, debit: 0, credit: 9800 },
        { accountId: 4, debit: 9800, credit: 0 }
      ]
    }
  ],
  siteLogs: [
    {
      id: 1,
      companyId: 1,
      branchId: 1,
      machineId: 1,
      machineNumber: "TN-30-BD-4492 (JCB 3DX)",
      customerId: 1,
      customerName: "KNR Constructions Salem Bypass Project",
      operatorId: 1,
      operatorName: "P. Murugan",
      siteLocation: "Omalur Bypass Section 3, Salem",
      workDate: "2026-03-03",
      date: "2026-03-03",
      startHours: 3820.0,
      startReading: 3820.0,
      endHours: 3828.5,
      endReading: 3828.5,
      totalHours: 8.5,
      dieselConsumed: 42.0,
      dieselFilledLiters: 42.0,
      workDescription: "Trenching and road basement leveling",
      status: "Working"
    },
    {
      id: 2,
      companyId: 1,
      branchId: 1,
      machineId: 2,
      machineNumber: "TN-30-CA-8819 (Hitachi EX200)",
      customerId: 2,
      customerName: "Sri Balaji Brick & Tiles Kiln",
      operatorId: 2,
      operatorName: "S. Kaliappan",
      siteLocation: "Mettur Red Clay Quarry",
      workDate: "2026-03-04",
      date: "2026-03-04",
      startHours: 5100.0,
      startReading: 5100.0,
      endHours: 5107.0,
      endReading: 5107.0,
      totalHours: 7.0,
      dieselConsumed: 55.0,
      dieselFilledLiters: 55.0,
      workDescription: "Heavy clay cutting and tipper loading",
      status: "Working"
    },
    {
      id: 3,
      companyId: 1,
      branchId: 1,
      machineId: 3,
      machineNumber: "TN-54-E-1902 (CAT 424B)",
      customerId: 3,
      customerName: "GK Farm Lands & Coconut Agro",
      operatorId: 3,
      operatorName: "M. Saravanan",
      siteLocation: "Namagiripettai Agro Yard",
      workDate: "2026-03-04",
      date: "2026-03-04",
      startHours: 1940.0,
      startReading: 1940.0,
      endHours: 1940.0,
      endReading: 1940.0,
      totalHours: 0.0,
      dieselConsumed: 0.0,
      dieselFilledLiters: 0.0,
      workDescription: "Hydraulic system preventive check",
      status: "Maintenance"
    }
  ],
  whatsappTemplates: [
    { id: 1, companyId: 1, title: "Booking Confirmation & Machine Dispatch", code: "BOOKING_CONFIRM", content: "Vanakkam {customer_name}! Your booking for {machine_name} is confirmed for site {site_location}. Operator: {operator_name} ({operator_phone}). Thank you, {company_name}." },
    { id: 2, companyId: 1, title: "GST Invoice & Payment Due Notice", code: "INVOICE_BILL", content: "Greetings from {company_name}. Tax Invoice #{invoice_number} for Rs. {amount} has been issued. Payment due: {due_date}. UPI/Account details attached." },
    { id: 3, companyId: 1, title: "Machine Shift Start Log Notification", code: "SHIFT_START", content: "Dear Customer, Machine {machine_number} has started operation at {start_time} with initial meter reading {start_reading}. Regards, {company_name}." }
  ],
  whatsAppTemplates: [
    { id: 1, companyId: 1, title: "Booking Confirmation & Machine Dispatch", code: "BOOKING_CONFIRM", content: "Vanakkam {customer_name}! Your booking for {machine_name} is confirmed for site {site_location}. Operator: {operator_name} ({operator_phone}). Thank you, {company_name}." },
    { id: 2, companyId: 1, title: "GST Invoice & Payment Due Notice", code: "INVOICE_BILL", content: "Greetings from {company_name}. Tax Invoice #{invoice_number} for Rs. {amount} has been issued. Payment due: {due_date}. UPI/Account details attached." },
    { id: 3, companyId: 1, title: "Machine Shift Start Log Notification", code: "SHIFT_START", content: "Dear Customer, Machine {machine_number} has started operation at {start_time} with initial meter reading {start_reading}. Regards, {company_name}." }
  ],
  whatsappCampaigns: [
    { id: 1, companyId: 1, title: "Pre-Monsoon Land Leveling & Canal Clearance Offer", date: "2026-03-01", totalSent: 180, delivered: 174, responseCount: 14, status: "COMPLETED" }
  ],
  whatsAppCampaigns: [
    { id: 1, companyId: 1, title: "Pre-Monsoon Land Leveling & Canal Clearance Offer", date: "2026-03-01", totalSent: 180, delivered: 174, responseCount: 14, status: "COMPLETED" }
  ],
  auditLogs: [
    { id: 1, companyId: 1, action: "USER_LOGIN", username: "admin", userName: "admin", ip: "127.0.0.1", timestamp: new Date().toISOString(), createdAt: new Date().toISOString(), details: "Successful admin console access" },
    { id: 2, companyId: 1, action: "CREATE_BOOKING", username: "admin", userName: "admin", ip: "127.0.0.1", timestamp: new Date().toISOString(), createdAt: new Date().toISOString(), details: "Created booking BKG-2026-0089 for KNR Constructions" }
  ],
  operators: [
    { id: 1, companyId: 1, branchId: 1, name: "P. Murugan", phone: "+91 97890 11223", licenseNumber: "DL-TN30-2014-00892", salaryType: "MONTHLY", salaryRate: 28000, experienceYears: 8, status: "AVAILABLE" },
    { id: 2, companyId: 1, branchId: 1, name: "S. Kaliappan", phone: "+91 98421 44556", licenseNumber: "DL-TN30-2011-00012", salaryType: "MONTHLY", salaryRate: 32000, experienceYears: 12, status: "ON_DUTY" }
  ],
  drivers: [
    { id: 1, companyId: 1, branchId: 1, name: "M. Saravanan", phone: "+91 94432 77889", licenseNumber: "DL-TN30-2018-00045", vehicleType: "Heavy Trailer / Lowbed", status: "AVAILABLE" }
  ],
  spareParts: [
    { id: 1, companyId: 1, partNumber: "JCB-HYD-SEAL-01", name: "JCB Hydraulic Boom Seal Kit", category: "HYDRAULICS", stockQuantity: 4, reorderLevel: 2, unitPrice: 3800, supplierName: "Salem Earthmover Spares" },
    { id: 2, companyId: 1, partNumber: "EX200-TOOTH-08", name: "Hitachi Heavy Bucket Tooth Point", category: "WEAR_PARTS", stockQuantity: 18, reorderLevel: 6, unitPrice: 1250, supplierName: "L&T Heavy Spares Coimbatore" }
  ],
  suppliers: [
    { id: 1, companyId: 1, name: "Salem Earthmover Spares & Hydraulic Hose Crimping", category: "SPARE_PARTS", contactPerson: "Rajendran", phone: "+91 98427 88990", gstin: "33ABCPR4928M1ZR", city: "Salem" },
    { id: 2, companyId: 1, name: "IOCL Swarnapuri Fuel Station", category: "DIESEL_FUEL", contactPerson: "K. Venkatesh", phone: "+91 94432 99881", gstin: "33AAACO0192A1ZV", city: "Salem" }
  ],
  rates: [
    { id: 1, companyId: 1, machineType: "Backhoe Loader (JCB 3DX)", unit: "HOUR", rateWithoutFuel: 1400, rateWithFuel: 1900, overtimeRate: 1500 },
    { id: 2, companyId: 1, machineType: "Heavy Excavator (20-Ton LC)", unit: "HOUR", rateWithoutFuel: 2800, rateWithFuel: 3800, overtimeRate: 3000 }
  ],
  purchases: [
    { id: 1, companyId: 1, supplierId: 1, supplierName: "Salem Earthmover Spares", invoiceNumber: "SUP-8821", date: "2026-03-02", amount: 14500, description: "Hydraulic oil drums 2x210L & filters", status: "PAID" }
  ],
  notifications: [
    { id: 1, companyId: 1, title: "Diesel Tanker Dispatched", message: "120 Litres delivered to JCB-3DX-01 at Omalur bypass site", type: "SUCCESS", isRead: false, read: false, createdAt: new Date().toISOString(), timestamp: new Date().toISOString() },
    { id: 2, companyId: 1, title: "Service Due Alert", message: "CAT-424B2 reached 1,940 hours. 2,000h major maintenance due soon.", type: "WARNING", isRead: false, read: false, createdAt: new Date().toISOString(), timestamp: new Date().toISOString() }
  ],
  rolesPermissions: [
    {
      roleName: "ADMIN",
      permissions: {
        dashboard: { view: true, create: true, edit: true, delete: true },
        machines: { view: true, create: true, edit: true, delete: true },
        customers: { view: true, create: true, edit: true, delete: true },
        bookings: { view: true, create: true, edit: true, delete: true },
        invoices: { view: true, create: true, edit: true, delete: true },
        accounts: { view: true, create: true, edit: true, delete: true },
        diesel: { view: true, create: true, edit: true, delete: true },
        maintenance: { view: true, create: true, edit: true, delete: true },
        employees: { view: true, create: true, edit: true, delete: true },
        crm: { view: true, create: true, edit: true, delete: true },
        reports: { view: true, create: true, edit: true, delete: true },
        settings: { view: true, create: true, edit: true, delete: true }
      }
    },
    {
      roleName: "MANAGER",
      permissions: {
        dashboard: { view: true, create: true, edit: true, delete: false },
        machines: { view: true, create: true, edit: true, delete: false },
        customers: { view: true, create: true, edit: true, delete: false },
        bookings: { view: true, create: true, edit: true, delete: false },
        invoices: { view: true, create: true, edit: true, delete: false },
        accounts: { view: true, create: false, edit: false, delete: false },
        diesel: { view: true, create: true, edit: true, delete: false },
        maintenance: { view: true, create: true, edit: true, delete: false },
        employees: { view: true, create: true, edit: false, delete: false },
        crm: { view: true, create: true, edit: true, delete: false },
        reports: { view: true, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false }
      }
    },
    {
      roleName: "ACCOUNTS",
      permissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        machines: { view: true, create: false, edit: false, delete: false },
        customers: { view: true, create: true, edit: true, delete: false },
        bookings: { view: true, create: false, edit: false, delete: false },
        invoices: { view: true, create: true, edit: true, delete: false },
        accounts: { view: true, create: true, edit: true, delete: false },
        diesel: { view: true, create: false, edit: false, delete: false },
        maintenance: { view: true, create: false, edit: false, delete: false },
        employees: { view: true, create: false, edit: false, delete: false },
        crm: { view: false, create: false, edit: false, delete: false },
        reports: { view: true, create: true, edit: true, delete: false },
        settings: { view: false, create: false, edit: false, delete: false }
      }
    },
    {
      roleName: "OPERATOR",
      permissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        machines: { view: true, create: false, edit: false, delete: false },
        customers: { view: false, create: false, edit: false, delete: false },
        bookings: { view: true, create: false, edit: false, delete: false },
        invoices: { view: false, create: false, edit: false, delete: false },
        accounts: { view: false, create: false, edit: false, delete: false },
        diesel: { view: true, create: true, edit: false, delete: false },
        maintenance: { view: true, create: true, edit: false, delete: false },
        employees: { view: false, create: false, edit: false, delete: false },
        crm: { view: false, create: false, edit: false, delete: false },
        reports: { view: false, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false }
      }
    }
  ],
  rolePermissions: [
    {
      roleName: "ADMIN",
      permissions: {
        dashboard: { view: true, create: true, edit: true, delete: true },
        machines: { view: true, create: true, edit: true, delete: true },
        customers: { view: true, create: true, edit: true, delete: true },
        bookings: { view: true, create: true, edit: true, delete: true },
        invoices: { view: true, create: true, edit: true, delete: true },
        accounts: { view: true, create: true, edit: true, delete: true },
        diesel: { view: true, create: true, edit: true, delete: true },
        maintenance: { view: true, create: true, edit: true, delete: true },
        employees: { view: true, create: true, edit: true, delete: true },
        crm: { view: true, create: true, edit: true, delete: true },
        reports: { view: true, create: true, edit: true, delete: true },
        settings: { view: true, create: true, edit: true, delete: true }
      }
    },
    {
      roleName: "MANAGER",
      permissions: {
        dashboard: { view: true, create: true, edit: true, delete: false },
        machines: { view: true, create: true, edit: true, delete: false },
        customers: { view: true, create: true, edit: true, delete: false },
        bookings: { view: true, create: true, edit: true, delete: false },
        invoices: { view: true, create: true, edit: true, delete: false },
        accounts: { view: true, create: false, edit: false, delete: false },
        diesel: { view: true, create: true, edit: true, delete: false },
        maintenance: { view: true, create: true, edit: true, delete: false },
        employees: { view: true, create: true, edit: false, delete: false },
        crm: { view: true, create: true, edit: true, delete: false },
        reports: { view: true, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false }
      }
    },
    {
      roleName: "ACCOUNTS",
      permissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        machines: { view: true, create: false, edit: false, delete: false },
        customers: { view: true, create: true, edit: true, delete: false },
        bookings: { view: true, create: false, edit: false, delete: false },
        invoices: { view: true, create: true, edit: true, delete: false },
        accounts: { view: true, create: true, edit: true, delete: false },
        diesel: { view: true, create: false, edit: false, delete: false },
        maintenance: { view: true, create: false, edit: false, delete: false },
        employees: { view: true, create: false, edit: false, delete: false },
        crm: { view: false, create: false, edit: false, delete: false },
        reports: { view: true, create: true, edit: true, delete: false },
        settings: { view: false, create: false, edit: false, delete: false }
      }
    },
    {
      roleName: "OPERATOR",
      permissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        machines: { view: true, create: false, edit: false, delete: false },
        customers: { view: false, create: false, edit: false, delete: false },
        bookings: { view: true, create: false, edit: false, delete: false },
        invoices: { view: false, create: false, edit: false, delete: false },
        accounts: { view: false, create: false, edit: false, delete: false },
        diesel: { view: true, create: true, edit: false, delete: false },
        maintenance: { view: true, create: true, edit: false, delete: false },
        employees: { view: false, create: false, edit: false, delete: false },
        crm: { view: false, create: false, edit: false, delete: false },
        reports: { view: false, create: false, edit: false, delete: false },
        settings: { view: false, create: false, edit: false, delete: false }
      }
    }
  ]
});

// Helper to track array mutations and auto-save
function createTrackedArray(arr, onMutate) {
  if (!Array.isArray(arr)) return arr;
  return new Proxy(arr, {
    set(target, prop, value) {
      const success = Reflect.set(target, prop, value);
      if (prop !== 'length') {
        onMutate();
      }
      return success;
    },
    get(target, prop) {
      const orig = target[prop];
      if (typeof orig === 'function' && ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].includes(prop)) {
        return function(...args) {
          const result = orig.apply(target, args);
          onMutate();
          return result;
        };
      }
      return orig;
    }
  });
}

export let db = {};let saveTimer = null;
const BACKUP_FILE = path.join(DATA_DIR, 'db.backup.json');

export const saveDbSync = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const jsonStr = JSON.stringify(db, null, 2);
    fs.writeFileSync(DB_FILE, jsonStr, 'utf-8');
    if (Array.isArray(db.crmLeads) && db.crmLeads.length > 0) {
      fs.writeFileSync(BACKUP_FILE, jsonStr, 'utf-8');
    }
  } catch (err) {
    console.error('[FileDB] Error saving db.json:', err);
  }
};

export const saveDb = () => {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        await fs.promises.mkdir(DATA_DIR, { recursive: true });
      }
      const jsonStr = JSON.stringify(db, null, 2);
      await fs.promises.writeFile(DB_FILE, jsonStr, 'utf-8');
      if (Array.isArray(db.crmLeads) && db.crmLeads.length > 0) {
        await fs.promises.writeFile(BACKUP_FILE, jsonStr, 'utf-8');
      }
    } catch (err) {
      console.error('[FileDB] Error saving db.json async:', err);
    }
  }, 50);
};

export const loadDb = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(raw);
    } else if (fs.existsSync(BACKUP_FILE)) {
      const raw = fs.readFileSync(BACKUP_FILE, 'utf-8');
      db = JSON.parse(raw);
    } else {
      db = getInitialData();
      saveDbSync();
    }
  } catch (err) {
    console.error('[FileDB] Failed to load db.json, checking backup:', err);
    if (fs.existsSync(BACKUP_FILE)) {
      try {
        const raw = fs.readFileSync(BACKUP_FILE, 'utf-8');
        db = JSON.parse(raw);
      } catch (be) {
        db = getInitialData();
        saveDbSync();
      }
    } else {
      db = getInitialData();
      saveDbSync();
    }
  }

  // Safety net: preserve leads from backup if main db has 0 leads
  if (fs.existsSync(BACKUP_FILE)) {
    try {
      const bRaw = fs.readFileSync(BACKUP_FILE, 'utf-8');
      const bDb = JSON.parse(bRaw);
      const bLeads = bDb.crmLeads || bDb.leads || [];
      const curLeads = db.crmLeads || db.leads || [];
      if (bLeads.length > curLeads.length) {
        console.log(`[FileDB] Preserving ${bLeads.length} leads from backup.`);
        db.crmLeads = bLeads;
        db.leads = bLeads;
      }
    } catch (e) {}
  }

  // Ensure all collections exist
  const initial = getInitialData();
  for (const key of Object.keys(initial)) {
    if (!Array.isArray(db[key])) {
      db[key] = initial[key] || [];
    }
    // Wrap with tracked array for auto-persistence on direct array mutations
    db[key] = createTrackedArray(db[key], () => saveDb());
  }

  // Link alias collections to share references
  if (db.leads && db.crmLeads && db.leads !== db.crmLeads) {
    if (db.crmLeads.length > db.leads.length) {
      db.leads = db.crmLeads;
    } else {
      db.crmLeads = db.leads;
    }
  } else if (db.leads && !db.crmLeads) {
    db.crmLeads = db.leads;
  } else if (db.crmLeads && !db.leads) {
    db.leads = db.crmLeads;
  }
  if (db.whatsappTemplates && !db.whatsAppTemplates) db.whatsAppTemplates = db.whatsappTemplates;
  if (db.whatsAppTemplates && !db.whatsappTemplates) db.whatsappTemplates = db.whatsAppTemplates;
  if (db.whatsappCampaigns && !db.whatsAppCampaigns) db.whatsAppCampaigns = db.whatsappCampaigns;
  if (db.whatsAppCampaigns && !db.whatsappCampaigns) db.whatsappCampaigns = db.whatsAppCampaigns;
  if (db.rolesPermissions && !db.rolePermissions) db.rolePermissions = db.rolesPermissions;
  if (db.rolePermissions && !db.rolesPermissions) db.rolePermissions = db.rolePermissions;

  return db;
};

export const resetDatabase = () => {
  console.log('[FileDB] Resetting database to initial enterprise state...');
  const initial = getInitialData();
  for (const key of Object.keys(initial)) {
    db[key] = createTrackedArray(initial[key], () => saveDb());
  }
  // Link aliases
  db.crmLeads = db.leads;
  db.whatsAppTemplates = db.whatsappTemplates;
  db.whatsAppCampaigns = db.whatsappCampaigns;
  db.rolePermissions = db.rolesPermissions;
  saveDb();
  return db;
};

export const initFileDb = () => {
  loadDb();
  console.log(`[FileDB] Local JSON database loaded successfully from: ${DB_FILE}`);
  return db;
};

// Auto-initialize on module load
initFileDb();

// Query matching utility
function matchItem(item, query) {
  if (!query || Object.keys(query).length === 0) return true;
  for (const key of Object.keys(query)) {
    if (key === '$or') {
      const orClauses = query.$or;
      if (Array.isArray(orClauses) && orClauses.length > 0) {
        const anyMatch = orClauses.some(clause => matchItem(item, clause));
        if (!anyMatch) return false;
      }
      continue;
    }
    if (key === '$and') {
      const andClauses = query.$and;
      if (Array.isArray(andClauses) && andClauses.length > 0) {
        const allMatch = andClauses.every(clause => matchItem(item, clause));
        if (!allMatch) return false;
      }
      continue;
    }

    const expected = query[key];
    const actual = item[key];

    if (expected instanceof RegExp) {
      if (!expected.test(String(actual || ''))) return false;
    } else if (expected && typeof expected === 'object' && !Array.isArray(expected)) {
      if ('$gte' in expected && !(actual >= expected.$gte)) return false;
      if ('$lte' in expected && !(actual <= expected.$lte)) return false;
      if ('$gt' in expected && !(actual > expected.$gt)) return false;
      if ('$lt' in expected && !(actual < expected.$lt)) return false;
      if ('$ne' in expected && actual === expected.$ne) return false;
      if ('$in' in expected && (!Array.isArray(expected.$in) || !expected.$in.includes(actual))) return false;
      if ('$nin' in expected && Array.isArray(expected.$nin) && expected.$nin.includes(actual)) return false;
    } else {
      if (actual != expected && String(actual) !== String(expected)) {
        return false;
      }
    }
  }
  return true;
}

// Wrap a raw JSON record into a document supporting Mongoose doc methods
function wrapDoc(rawItem, collectionName) {
  if (!rawItem) return null;
  if (rawItem.id === undefined && rawItem._id !== undefined) {
    rawItem.id = rawItem._id;
  }
  if (!rawItem._id && rawItem.id !== undefined) {
    rawItem._id = String(rawItem.id);
  }

  const doc = Object.create({
    toObject() {
      return { ...rawItem };
    },
    toJSON() {
      return this.toObject();
    },
    async save() {
      const arr = db[collectionName] || [];
      const idx = arr.findIndex(x => (x.id && x.id === rawItem.id) || (x._id && x._id === rawItem._id));
      if (idx !== -1) {
        arr[idx] = { ...rawItem, updatedAt: new Date().toISOString() };
      } else {
        arr.push(rawItem);
      }
      saveDb();
      return this;
    },
    async deleteOne() {
      const arr = db[collectionName] || [];
      const idx = arr.findIndex(x => (x.id && x.id === rawItem.id) || (x._id && x._id === rawItem._id));
      if (idx !== -1) {
        arr.splice(idx, 1);
        saveDb();
      }
      return { acknowledged: true, deletedCount: 1 };
    }
  });

  Object.assign(doc, rawItem);
  return doc;
}

// Chainable query builder
function createQuery(getItemsFn, isSingle = false) {
  let sortCriteria = null;
  let limitNum = null;
  let skipNum = null;
  let selectedFields = null;

  const queryObj = {
    sort(criteria) {
      sortCriteria = criteria;
      return queryObj;
    },
    limit(n) {
      limitNum = n;
      return queryObj;
    },
    skip(n) {
      skipNum = n;
      return queryObj;
    },
    select(fields) {
      selectedFields = fields;
      return queryObj;
    },
    lean() {
      return queryObj;
    },
    populate() {
      return queryObj;
    },
    exec() {
      let items = getItemsFn();
      if (sortCriteria) {
        items = [...items].sort((a, b) => {
          for (const [k, dir] of Object.entries(sortCriteria)) {
            const valA = a[k];
            const valB = b[k];
            if (valA === valB) continue;
            if (valA === undefined || valA === null) return dir === -1 ? 1 : -1;
            if (valB === undefined || valB === null) return dir === -1 ? -1 : 1;
            if (valA > valB) return dir === -1 ? -1 : 1;
            if (valA < valB) return dir === -1 ? 1 : -1;
          }
          return 0;
        });
      }
      if (skipNum) {
        items = items.slice(skipNum);
      }
      if (limitNum) {
        items = items.slice(0, limitNum);
      }
      if (isSingle) {
        return items.length > 0 ? items[0] : null;
      }
      return items;
    },
    then(resolve, reject) {
      try {
        const res = queryObj.exec();
        return Promise.resolve(res).then(resolve, reject);
      } catch (err) {
        return Promise.reject(err).catch(reject);
      }
    },
    catch(reject) {
      return queryObj.then(undefined, reject);
    }
  };

  return queryObj;
}

// Mongoose-compatible Model Factory
export function createModel(collectionName) {
  const getCollection = () => {
    if (!Array.isArray(db[collectionName])) {
      db[collectionName] = createTrackedArray([], () => saveDb());
    }
    return db[collectionName];
  };

  return {
    collectionName,
    find(query = {}) {
      return createQuery(() => {
        const arr = getCollection();
        const matched = arr.filter(item => matchItem(item, query));
        return matched.map(item => wrapDoc(item, collectionName));
      }, false);
    },

    findOne(query = {}) {
      return createQuery(() => {
        const arr = getCollection();
        const matched = arr.filter(item => matchItem(item, query));
        return matched.map(item => wrapDoc(item, collectionName));
      }, true);
    },

    findById(id) {
      return createQuery(() => {
        const arr = getCollection();
        const numId = Number(id);
        const item = arr.find(x =>
          x.id === id ||
          x._id === id ||
          (numId && !isNaN(numId) && x.id === numId) ||
          (numId && !isNaN(numId) && Number(x.id) === numId)
        );
        return item ? [wrapDoc(item, collectionName)] : [];
      }, true);
    },

    async create(data) {
      const arr = getCollection();
      const docsToCreate = Array.isArray(data) ? data : [data];
      const createdDocs = [];

      for (const item of docsToCreate) {
        const maxId = arr.reduce((max, x) => Math.max(max, typeof x.id === 'number' ? x.id : (Number(x.id) || 0)), 0);
        const newId = item.id !== undefined ? item.id : (maxId + 1);
        const now = new Date().toISOString();
        const docRecord = {
          ...item,
          id: newId,
          _id: item._id || String(newId),
          createdAt: item.createdAt || now,
          updatedAt: item.updatedAt || now
        };
        arr.push(docRecord);
        createdDocs.push(wrapDoc(docRecord, collectionName));
      }

      saveDb();
      return Array.isArray(data) ? createdDocs : createdDocs[0];
    },

    async insertMany(data) {
      const docs = Array.isArray(data) ? data : [data];
      return this.create(docs);
    },

    async countDocuments(query = {}) {
      const arr = getCollection();
      return arr.filter(item => matchItem(item, query)).length;
    },

    async findByIdAndUpdate(id, update, options = { new: true }) {
      const arr = getCollection();
      const numId = Number(id);
      const idx = arr.findIndex(x =>
        x.id === id ||
        x._id === id ||
        (numId && !isNaN(numId) && x.id === numId) ||
        (numId && !isNaN(numId) && Number(x.id) === numId)
      );
      if (idx === -1) return null;
      const current = arr[idx];
      const updateData = update.$set ? { ...update.$set } : { ...update };
      delete updateData.$set;
      const updatedRecord = {
        ...current,
        ...updateData,
        id: current.id,
        _id: current._id,
        updatedAt: new Date().toISOString()
      };
      arr[idx] = updatedRecord;
      saveDb();
      return wrapDoc(updatedRecord, collectionName);
    },

    async updateOne(query = {}, update = {}) {
      const arr = getCollection();
      const idx = arr.findIndex(item => matchItem(item, query));
      if (idx === -1) return { acknowledged: true, modifiedCount: 0 };
      const current = arr[idx];
      let updateData = update.$set ? { ...update.$set } : { ...update };
      if (update.$max) {
        for (const [k, v] of Object.entries(update.$max)) {
          if (Number(v) > (Number(current[k]) || 0)) {
            updateData[k] = v;
          }
        }
      }
      delete updateData.$set;
      delete updateData.$max;
      const updatedRecord = {
        ...current,
        ...updateData,
        id: current.id,
        _id: current._id,
        updatedAt: new Date().toISOString()
      };
      arr[idx] = updatedRecord;
      saveDb();
      return { acknowledged: true, modifiedCount: 1 };
    },

    async findByIdAndDelete(id) {
      const arr = getCollection();
      const numId = Number(id);
      const idx = arr.findIndex(x =>
        x.id === id ||
        x._id === id ||
        (numId && !isNaN(numId) && x.id === numId) ||
        (numId && !isNaN(numId) && Number(x.id) === numId)
      );
      if (idx === -1) return null;
      const removed = arr.splice(idx, 1)[0];
      saveDb();
      return wrapDoc(removed, collectionName);
    },

    async deleteOne(query = {}) {
      const arr = getCollection();
      const idx = arr.findIndex(item => matchItem(item, query));
      if (idx !== -1) {
        arr.splice(idx, 1);
        saveDb();
        return { acknowledged: true, deletedCount: 1 };
      }
      return { acknowledged: true, deletedCount: 0 };
    },

    async deleteMany(query = {}) {
      const arr = getCollection();
      const initialLen = arr.length;
      const remaining = arr.filter(item => !matchItem(item, query));
      db[collectionName] = createTrackedArray(remaining, () => saveDb());
      saveDb();
      return { acknowledged: true, deletedCount: initialLen - remaining.length };
    }
  };
}

export default db;
