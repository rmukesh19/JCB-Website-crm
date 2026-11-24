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
    { id: 1, companyId: 1, branchId: 1, code: "JCB-3DX-01", name: "JCB 3DX Super Eco", modelName: "JCB 3DX Super Eco", type: "Backhoe Loader", regNumber: "TN-30-BD-4492", plateNumber: "TN-30-BD-4492", chasisNumber: "HAR3DX981249", chassisNumber: "HAR3DX981249", engineNumber: "ENG3DX8812", yom: 2022, currentMeterReading: 0, currentHours: 0, nextServiceDueHours: 250, ownership: "OWNED", defaultRatePerHour: 1400, hourlyRate: 1400, dailyRate: 10500, weeklyRate: 65000, monthlyRate: 250000, defaultRateWithDiesel: 1900, status: "AVAILABLE", assignedOperatorId: null },
    { id: 2, companyId: 1, branchId: 1, code: "HITACHI-EX200", name: "Tata Hitachi EX200 LC", modelName: "Tata Hitachi EX200 LC", type: "Heavy Excavator", regNumber: "TN-30-CA-8819", plateNumber: "TN-30-CA-8819", chasisNumber: "THEX200984128", chassisNumber: "THEX200984128", engineNumber: "ENGEX200941", yom: 2021, currentMeterReading: 0, currentHours: 0, nextServiceDueHours: 150, ownership: "OWNED", defaultRatePerHour: 2800, hourlyRate: 2800, dailyRate: 21000, weeklyRate: 130000, monthlyRate: 500000, defaultRateWithDiesel: 3800, status: "AVAILABLE", assignedOperatorId: null },
    { id: 3, companyId: 1, branchId: 1, code: "CAT-424B", name: "Caterpillar 424B2", modelName: "Caterpillar 424B2", type: "Backhoe Loader", regNumber: "TN-54-E-1902", plateNumber: "TN-54-E-1902", chasisNumber: "CAT424B889211", chassisNumber: "CAT424B889211", engineNumber: "ENGCAT424B12", yom: 2023, currentMeterReading: 0, currentHours: 0, nextServiceDueHours: 250, ownership: "OWNED", defaultRatePerHour: 1500, hourlyRate: 1500, dailyRate: 11500, weeklyRate: 70000, monthlyRate: 270000, defaultRateWithDiesel: 2050, status: "AVAILABLE", assignedOperatorId: null }
  ],
  customers: [],
  bookings: [],
  invoices: [],
  expenses: [],
  dieselRecords: [],
  maintenanceRecords: [],
  employees: [],
  attendance: [],
  salarySlips: [],
  leads: [],
  crmLeads: [],
  accounts: [],
  transactions: [],
  siteLogs: [],
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
  whatsappCampaigns: [],
  whatsAppCampaigns: [],
  auditLogs: [],
  operators: [],
  drivers: [],
  spareParts: [],
  suppliers: [],
  rates: [
    { id: 1, companyId: 1, machineType: "Backhoe Loader (JCB 3DX)", unit: "HOUR", rateWithoutFuel: 1400, rateWithFuel: 1900, overtimeRate: 1500 },
    { id: 2, companyId: 1, machineType: "Heavy Excavator (20-Ton LC)", unit: "HOUR", rateWithoutFuel: 2800, rateWithFuel: 3800, overtimeRate: 3000 }
  ],
  purchases: [],
  notifications: [],
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

// Optimized helper to track array mutations without leaking closures
const ARRAY_MUTATING_METHODS = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

function createTrackedArray(arr, onMutate) {
  if (!Array.isArray(arr)) return arr;
  const methodCache = new Map();

  return new Proxy(arr, {
    set(target, prop, value) {
      const success = Reflect.set(target, prop, value);
      if (prop !== 'length') {
        onMutate();
      }
      return success;
    },
    get(target, prop) {
      if (ARRAY_MUTATING_METHODS.includes(prop)) {
        let fn = methodCache.get(prop);
        if (!fn) {
          const orig = target[prop];
          fn = function(...args) {
            const result = orig.apply(target, args);
            onMutate();
            return result;
          };
          methodCache.set(prop, fn);
        }
        return fn;
      }
      return target[prop];
    }
  });
}

// In-Memory Index Engine for O(1) primary lookups and O(K) indexed queries
class CollectionIndex {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.primaryMap = new Map();
    this.secondaryIndexes = new Map();
    this.indexedFields = new Set([
      'companyId', 'status', 'mobileNumber', 'phone', 'username',
      'email', 'date', 'startDate', 'customerId', 'machineId', 'customerType'
    ]);
    for (const field of this.indexedFields) {
      this.secondaryIndexes.set(field, new Map());
    }
  }

  rebuild(arr) {
    this.primaryMap.clear();
    for (const field of this.indexedFields) {
      this.secondaryIndexes.get(field).clear();
    }
    if (!Array.isArray(arr)) return;
    for (let i = 0; i < arr.length; i++) {
      this.indexDoc(arr[i]);
    }
  }

  indexDoc(item) {
    if (!item) return;
    if (item.id !== undefined && item.id !== null) {
      this.primaryMap.set(String(item.id), item);
      if (typeof item.id === 'number') this.primaryMap.set(item.id, item);
    }
    if (item._id !== undefined && item._id !== null) {
      this.primaryMap.set(String(item._id), item);
    }

    for (const field of this.indexedFields) {
      if (item[field] !== undefined && item[field] !== null) {
        const fieldMap = this.secondaryIndexes.get(field);
        if (fieldMap) {
          const val = String(item[field]);
          let set = fieldMap.get(val);
          if (!set) {
            set = new Set();
            fieldMap.set(val, set);
          }
          set.add(item);
        }
      }
    }
  }

  unindexDoc(item) {
    if (!item) return;
    if (item.id !== undefined && item.id !== null) {
      this.primaryMap.delete(String(item.id));
      if (typeof item.id === 'number') this.primaryMap.delete(item.id);
    }
    if (item._id !== undefined && item._id !== null) {
      this.primaryMap.delete(String(item._id));
    }

    for (const field of this.indexedFields) {
      if (item[field] !== undefined && item[field] !== null) {
        const fieldMap = this.secondaryIndexes.get(field);
        if (fieldMap) {
          const val = String(item[field]);
          const set = fieldMap.get(val);
          if (set) {
            set.delete(item);
            if (set.size === 0) fieldMap.delete(val);
          }
        }
      }
    }
  }

  findById(id) {
    return this.primaryMap.get(id) || this.primaryMap.get(String(id)) || null;
  }

  getCandidates(query, fullArr) {
    if (!query || typeof query !== 'object' || Object.keys(query).length === 0) {
      return fullArr;
    }

    if (query.id !== undefined && typeof query.id !== 'object') {
      const doc = this.findById(query.id);
      return doc ? [doc] : [];
    }
    if (query._id !== undefined && typeof query._id !== 'object') {
      const doc = this.findById(query._id);
      return doc ? [doc] : [];
    }

    for (const [key, val] of Object.entries(query)) {
      if (this.indexedFields.has(key) && val !== null && val !== undefined && typeof val !== 'object') {
        const fieldMap = this.secondaryIndexes.get(key);
        if (fieldMap) {
          const set = fieldMap.get(String(val));
          if (!set || set.size === 0) return [];
          return Array.from(set);
        }
      }
    }

    return fullArr;
  }
}

const indexes = new Map();
function getIndex(colName) {
  let idx = indexes.get(colName);
  if (!idx) {
    idx = new CollectionIndex(colName);
    indexes.set(colName, idx);
    if (Array.isArray(db[colName])) {
      idx.rebuild(db[colName]);
    }
  }
  return idx;
}

export let db = {};
let saveTimer = null;
const BACKUP_FILE = path.join(DATA_DIR, 'db.backup.json');

// Cap ephemeral collections to prevent memory leaks under heavy usage
const MAX_AUDIT_LOGS = 5000;
const MAX_NOTIFICATIONS = 1000;

function enforceMemoryBounds() {
  if (Array.isArray(db.auditLogs) && db.auditLogs.length > MAX_AUDIT_LOGS) {
    db.auditLogs.splice(0, db.auditLogs.length - MAX_AUDIT_LOGS);
  }
  if (Array.isArray(db.notifications) && db.notifications.length > MAX_NOTIFICATIONS) {
    db.notifications.splice(0, db.notifications.length - MAX_NOTIFICATIONS);
  }
}

export const saveDbSync = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    enforceMemoryBounds();
    const jsonStr = JSON.stringify(db);
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
      enforceMemoryBounds();
      // Minified atomic write via temporary file prevents crash corruption and reduces memory & disk IO
      const jsonStr = JSON.stringify(db);
      const tempFile = `${DB_FILE}.tmp`;
      await fs.promises.writeFile(tempFile, jsonStr, 'utf-8');
      await fs.promises.rename(tempFile, DB_FILE);

      if (Array.isArray(db.crmLeads) && db.crmLeads.length > 0) {
        await fs.promises.writeFile(BACKUP_FILE, jsonStr, 'utf-8');
      }
    } catch (err) {
      console.error('[FileDB] Error saving db.json async:', err);
    }
  }, 75);
  if (saveTimer.unref) saveTimer.unref();
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
  saveDbSync();
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

// Chainable query builder with .lean() and .select() acceleration
function createQuery(getItemsFn, isSingle = false) {
  let sortCriteria = null;
  let limitNum = null;
  let skipNum = null;
  let selectedFields = null;
  let isLean = false;

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
    lean(val = true) {
      isLean = val !== false;
      return queryObj;
    },
    populate() {
      return queryObj;
    },
    exec() {
      let items = getItemsFn(isLean);
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

      // Fast field projection if select was used
      if (selectedFields) {
        const fieldList = typeof selectedFields === 'string'
          ? selectedFields.split(/\s+/).filter(Boolean)
          : Object.keys(selectedFields).filter(k => selectedFields[k]);

        if (fieldList.length > 0) {
          const isExclusion = fieldList.some(f => f.startsWith('-'));
          items = items.map(doc => {
            const raw = isLean ? doc : (doc.toObject ? doc.toObject() : doc);
            const proj = {};
            if (isExclusion) {
              const excluded = new Set(fieldList.map(f => f.replace(/^-/, '')));
              for (const [k, v] of Object.entries(raw)) {
                if (!excluded.has(k)) proj[k] = v;
              }
            } else {
              proj.id = raw.id;
              proj._id = raw._id;
              for (const f of fieldList) {
                if (raw[f] !== undefined) proj[f] = raw[f];
              }
            }
            return isLean ? proj : wrapDoc(proj, 'projected');
          });
        }
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

// Mongoose-compatible Model Factory with In-Memory Index Acceleration
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
      return createQuery((leanMode) => {
        const arr = getCollection();
        const idx = getIndex(collectionName);
        const candidates = idx.getCandidates(query, arr);
        const matched = candidates.filter(item => matchItem(item, query));
        return leanMode ? matched : matched.map(item => wrapDoc(item, collectionName));
      }, false);
    },

    findOne(query = {}) {
      return createQuery((leanMode) => {
        const arr = getCollection();
        const idx = getIndex(collectionName);
        const candidates = idx.getCandidates(query, arr);
        const matched = candidates.filter(item => matchItem(item, query));
        return leanMode ? matched : matched.map(item => wrapDoc(item, collectionName));
      }, true);
    },

    findById(id) {
      return createQuery((leanMode) => {
        const idx = getIndex(collectionName);
        let item = idx.findById(id);
        if (!item) {
          const numId = Number(id);
          if (numId && !isNaN(numId)) {
            item = idx.findById(numId);
          }
        }
        if (!item) {
          const arr = getCollection();
          item = arr.find(x => x.id == id || x._id == id);
        }
        if (!item) return [];
        return leanMode ? [item] : [wrapDoc(item, collectionName)];
      }, true);
    },

    async create(data) {
      const arr = getCollection();
      const idx = getIndex(collectionName);
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
        idx.indexDoc(docRecord);
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
      const idx = getIndex(collectionName);
      const candidates = idx.getCandidates(query, arr);
      return candidates.filter(item => matchItem(item, query)).length;
    },

    async findByIdAndUpdate(id, update, options = { new: true }) {
      const arr = getCollection();
      const idx = getIndex(collectionName);
      let existing = idx.findById(id);
      let arrayIndex = -1;

      if (existing) {
        arrayIndex = arr.indexOf(existing);
      } else {
        const numId = Number(id);
        arrayIndex = arr.findIndex(x => x.id == id || x._id == id || (numId && Number(x.id) === numId));
      }

      if (arrayIndex === -1) return null;
      const current = arr[arrayIndex];
      const updateData = update.$set ? { ...update.$set } : { ...update };
      delete updateData.$set;

      idx.unindexDoc(current);
      const updatedRecord = {
        ...current,
        ...updateData,
        id: current.id,
        _id: current._id,
        updatedAt: new Date().toISOString()
      };
      arr[arrayIndex] = updatedRecord;
      idx.indexDoc(updatedRecord);
      saveDb();
      return wrapDoc(updatedRecord, collectionName);
    },

    async updateOne(query = {}, update = {}) {
      const arr = getCollection();
      const idx = getIndex(collectionName);
      const candidates = idx.getCandidates(query, arr);
      const target = candidates.find(item => matchItem(item, query));
      if (!target) return { acknowledged: true, modifiedCount: 0 };

      const arrayIndex = arr.indexOf(target);
      if (arrayIndex === -1) return { acknowledged: true, modifiedCount: 0 };

      let updateData = update.$set ? { ...update.$set } : { ...update };
      if (update.$max) {
        for (const [k, v] of Object.entries(update.$max)) {
          if (Number(v) > (Number(target[k]) || 0)) {
            updateData[k] = v;
          }
        }
      }
      delete updateData.$set;
      delete updateData.$max;

      idx.unindexDoc(target);
      const updatedRecord = {
        ...target,
        ...updateData,
        id: target.id,
        _id: target._id,
        updatedAt: new Date().toISOString()
      };
      arr[arrayIndex] = updatedRecord;
      idx.indexDoc(updatedRecord);
      saveDb();
      return { acknowledged: true, modifiedCount: 1 };
    },

    async findByIdAndDelete(id) {
      const arr = getCollection();
      const idx = getIndex(collectionName);
      const existing = idx.findById(id);
      let arrayIndex = -1;

      if (existing) {
        arrayIndex = arr.indexOf(existing);
      } else {
        const numId = Number(id);
        arrayIndex = arr.findIndex(x => x.id == id || x._id == id || (numId && Number(x.id) === numId));
      }

      if (arrayIndex === -1) return null;
      const removed = arr.splice(arrayIndex, 1)[0];
      idx.unindexDoc(removed);
      saveDb();
      return wrapDoc(removed, collectionName);
    },

    async deleteOne(query = {}) {
      const arr = getCollection();
      const idx = getIndex(collectionName);
      const candidates = idx.getCandidates(query, arr);
      const target = candidates.find(item => matchItem(item, query));
      if (!target) return { acknowledged: true, deletedCount: 0 };

      const arrayIndex = arr.indexOf(target);
      if (arrayIndex !== -1) {
        arr.splice(arrayIndex, 1);
        idx.unindexDoc(target);
        saveDb();
        return { acknowledged: true, deletedCount: 1 };
      }
      return { acknowledged: true, deletedCount: 0 };
    },

    async deleteMany(query = {}) {
      const arr = getCollection();
      const idx = getIndex(collectionName);
      const initialLen = arr.length;
      const remaining = arr.filter(item => !matchItem(item, query));
      db[collectionName] = createTrackedArray(remaining, () => saveDb());
      idx.rebuild(remaining);
      saveDb();
      return { acknowledged: true, deletedCount: initialLen - remaining.length };
    }
  };
}

export default db;
