import multer from 'multer';
import * as XLSX from 'xlsx';
import { Readable } from 'stream';

/**
 * In-memory Multer storage
 * Intercepts Excel/CSV file uploads in memory without writing directly to disk.
 */
const memoryStorage = multer.memoryStorage();

/**
 * Allowed MIME types and extensions for Excel / CSV spreadsheets
 */
const ALLOWED_EXTENSIONS = ['.xlsx', '.xls', '.csv', '.tsv', '.ods', '.txt'];
const ALLOWED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel',                                         // .xls
  'application/vnd.oasis.opendocument.spreadsheet',                   // .ods
  'text/csv',                                                         // .csv
  'application/csv',
  'text/plain',
  'text/tab-separated-values',
  'application/octet-stream'                                          // generic fallback
];

/**
 * File filter to ensure only spreadsheet / CSV files are uploaded
 */
const fileFilter = (req, file, cb) => {
  const originalName = (file.originalname || '').toLowerCase();
  const hasValidExt = ALLOWED_EXTENSIONS.some(ext => originalName.endsWith(ext));
  const hasValidMime = ALLOWED_MIME_TYPES.includes(file.mimetype) || file.mimetype.includes('sheet') || file.mimetype.includes('excel') || file.mimetype.includes('csv');

  if (hasValidExt || hasValidMime || !file.mimetype) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type (${file.mimetype}). Please upload Excel (.xlsx, .xls) or CSV (.csv, .tsv, .txt) files.`));
  }
};

/**
 * Multer upload handler configured with 20MB file limit
 */
export const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB max size
  },
  fileFilter
});

/**
 * Normalize and clean a single header / key string
 */
const cleanKey = (key) => {
  if (typeof key !== 'string') return '';
  return key
    .replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '') // trim whitespace & BOM
    .trim();
};

/**
 * Common column name mappings for CRM leads & fleet data
 */
const COLUMN_ALIASES = {
  customername: 'customerName',
  clientname: 'customerName',
  name: 'customerName',
  client: 'customerName',
  customer: 'customerName',
  lead: 'customerName',
  leadname: 'customerName',
  fullname: 'customerName',
  person: 'customerName',
  partyname: 'customerName',
  party: 'customerName',
  title: 'customerName',
  contactperson: 'customerName',
  companyname: 'companyName',
  company: 'companyName',
  businessname: 'companyName',
  firm: 'companyName',
  firmname: 'companyName',
  customertype: 'customerType',
  sector: 'customerType',
  businesstype: 'customerType',
  type: 'customerType',
  category: 'customerType',
  segment: 'customerType',
  mobilenumber: 'mobileNumber',
  mobile: 'mobileNumber',
  phone: 'mobileNumber',
  phonenumber: 'mobileNumber',
  mob: 'mobileNumber',
  cell: 'mobileNumber',
  cellphone: 'mobileNumber',
  contact: 'mobileNumber',
  contactnumber: 'mobileNumber',
  whatsappnumber: 'whatsAppNumber',
  whatsapp: 'whatsAppNumber',
  whatsappno: 'whatsAppNumber',
  wa: 'whatsAppNumber',
  wanumber: 'whatsAppNumber',
  email: 'email',
  emailaddress: 'email',
  mail: 'email',
  district: 'district',
  city: 'district',
  place: 'district',
  town: 'district',
  area: 'area',
  location: 'area',
  site: 'area',
  address: 'address',
  interestedmachine: 'interestedMachine',
  machine: 'interestedMachine',
  machinery: 'interestedMachine',
  machinemodel: 'interestedMachine',
  equipment: 'interestedMachine',
  vehicle: 'interestedMachine',
  rentalrequirement: 'rentalRequirement',
  requirement: 'rentalRequirement',
  rentaltype: 'rentalRequirement',
  renttype: 'rentalRequirement',
  budget: 'budget',
  budgetinr: 'budget',
  rate: 'budget',
  amount: 'budget',
  cost: 'budget',
  value: 'budget',
  price: 'budget',
  leadsource: 'leadSource',
  source: 'leadSource',
  priority: 'priority',
  status: 'status',
  stage: 'status',
  marketingexecutive: 'marketingExecutive',
  salesexecutive: 'marketingExecutive',
  expectedbookingdate: 'expectedBookingDate',
  remarks: 'remarks',
  notes: 'notes'
};

/**
 * Sanitize an individual cell value
 */
const sanitizeValue = (val) => {
  if (val === null || val === undefined) return '';
  if (val instanceof Date) return val.toISOString();
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val;

  // String cleanup: strip control characters and null bytes
  const str = String(val)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();

  return str;
};

/**
 * Sanitize array of records:
 * 1. Prevents Object Prototype Pollution (__proto__, constructor, prototype)
 * 2. Normalizes column names (e.g. "Customer Name" -> "customerName")
 * 3. Strips MongoDB injection characters ($)
 * 4. Filters out blank rows
 */
export const sanitizeRecords = (rawRows = []) => {
  if (!Array.isArray(rawRows)) return [];

  const sanitized = [];

  for (const rawRow of rawRows) {
    if (!rawRow || typeof rawRow !== 'object') continue;

    const rowObj = {};
    let hasNonEmptyField = false;

    for (const [rawKey, rawVal] of Object.entries(rawRow)) {
      const sanitizedKey = cleanKey(rawKey);

      // Block prototype pollution & MongoDB operator injection
      if (
        !sanitizedKey ||
        sanitizedKey.includes('__proto__') ||
        sanitizedKey === 'constructor' ||
        sanitizedKey === 'prototype' ||
        sanitizedKey.startsWith('$')
      ) {
        continue;
      }

      const val = sanitizeValue(rawVal);
      if (val !== '' && val !== null && val !== undefined) {
        hasNonEmptyField = true;
      }

      // Preserve sanitized original key
      rowObj[sanitizedKey] = val;

      // Also assign normalized alias key if matched
      const lookupKey = sanitizedKey.toLowerCase().replace(/[^a-z0-9]/g, '');
      const aliasKey = COLUMN_ALIASES[lookupKey];
      if (aliasKey && aliasKey !== sanitizedKey) {
        rowObj[aliasKey] = val;
      }
    }

    // Ensure common convenience fields are populated if aliases exist
    if (rowObj.customerName && !rowObj.name) rowObj.name = rowObj.customerName;
    if (rowObj.name && !rowObj.customerName) rowObj.customerName = rowObj.name;
    if (rowObj.mobileNumber && !rowObj.phone) rowObj.phone = rowObj.mobileNumber;
    if (rowObj.phone && !rowObj.mobileNumber) rowObj.mobileNumber = rowObj.phone;
    if (rowObj.mobileNumber && !rowObj.whatsAppNumber) rowObj.whatsAppNumber = rowObj.mobileNumber;
    if (rowObj.customerType && !rowObj.businessType) rowObj.businessType = rowObj.customerType;
    if (rowObj.businessType && !rowObj.customerType) rowObj.customerType = rowObj.businessType;

    // Only include rows that have actual data
    if (hasNonEmptyField) {
      sanitized.push(rowObj);
    }
  }

  return sanitized;
};

/**
 * Parse an Excel/CSV buffer in-memory into:
 * 1. JSON Array of row objects
 * 2. CSV formatted string
 */
export const parseExcelBuffer = (buffer) => {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('Valid spreadsheet buffer is required');
  }

  // Parse workbook directly from memory buffer
  const workbook = XLSX.read(buffer, {
    type: 'buffer',
    cellDates: true,
    dateNF: 'yyyy-mm-dd',
    raw: false,
    dense: true
  });

  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('Spreadsheet does not contain any worksheets');
  }

  // Select first sheet by default
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  if (!worksheet) {
    throw new Error(`Worksheet "${firstSheetName}" could not be read`);
  }

  // Convert worksheet to raw JSON objects
  const rawRows = XLSX.utils.sheet_to_json(worksheet, {
    defval: '',
    raw: false,
    blankrows: false
  });

  // Convert worksheet to in-memory CSV string
  const csvString = XLSX.utils.sheet_to_csv(worksheet, {
    blankrows: false
  });

  return {
    sheetName: firstSheetName,
    rawRows,
    csvString
  };
};

/**
 * Express Middleware:
 * Intercepts Excel (.xlsx, .xls) and CSV file uploads using Multer.
 * Converts spreadsheet into a sanitized JSON array and in-memory CSV stream,
 * then passes records to the next controller via req.sanitizedRecords & req.csvStream.
 *
 * @param {string} fieldName - The multipart form field name (default: 'file')
 */
export const excelUploadMiddleware = (fieldName = 'file') => {
  const singleUpload = upload.single(fieldName);

  return (req, res, next) => {
    singleUpload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
              success: false,
              code: 'FILE_TOO_LARGE',
              error: 'Spreadsheet file size exceeds maximum 20MB limit'
            });
          }
          return res.status(400).json({
            success: false,
            code: 'UPLOAD_ERROR',
            error: `Multer upload error: ${err.message}`
          });
        }
        return res.status(400).json({
          success: false,
          code: 'INVALID_FILE',
          error: err.message
        });
      }

      // If no file was uploaded, check if JSON payload was passed in req.body
      if (!req.file) {
        // If client already sent JSON data in body, sanitize and continue
        const candidateData = Array.isArray(req.body) ? req.body : (req.body?.leads || req.body?.data || null);
        if (candidateData && Array.isArray(candidateData)) {
          req.sanitizedRecords = sanitizeRecords(candidateData);
          req.body.leads = req.sanitizedRecords;
        }
        return next();
      }

      try {
        // Parse spreadsheet buffer entirely in memory
        const { rawRows, csvString, sheetName } = parseExcelBuffer(req.file.buffer);

        // Sanitize rows for safe MongoDB / model insertion
        const sanitizedRecords = sanitizeRecords(rawRows);

        // Create an in-memory CSV readable stream
        const csvStream = Readable.from([csvString]);

        // Attach parsed artifacts to the request object for downstream controllers
        req.sanitizedRecords = sanitizedRecords;
        req.csvStream = csvStream;
        req.csvString = csvString;
        req.parsedSheetName = sheetName;

        // Also inject into req.body.leads so existing controllers work out of the box
        if (!req.body) req.body = {};
        req.body.leads = sanitizedRecords;
        req.body.data = sanitizedRecords;

        console.log(`[ExcelUploadMiddleware] Successfully intercepted & converted "${req.file.originalname}" (${req.file.size} bytes, ${sanitizedRecords.length} records parsed from "${sheetName}")`);

        return next();
      } catch (parseError) {
        console.error('[ExcelUploadMiddleware] Parsing error:', parseError);
        return res.status(400).json({
          success: false,
          code: 'EXCEL_PARSE_ERROR',
          error: `Failed to parse Excel/CSV spreadsheet: ${parseError.message}`
        });
      }
    });
  };
};

export default excelUploadMiddleware;
