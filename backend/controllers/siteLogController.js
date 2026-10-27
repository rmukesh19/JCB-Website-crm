import SiteLog from '../models/SiteLog.js';
import Machine from '../models/Machine.js';
import Customer from '../models/Customer.js';
import Operator from '../models/Operator.js';

const safeIdQuery = (id) => {
  const num = Number(id);
  const queries = [];
  if (!isNaN(num)) {
    queries.push({ id: num });
  }
  if (id && String(id).length === 24) {
    queries.push({ _id: id });
  }
  if (queries.length === 1) return queries[0];
  if (queries.length > 1) return { $or: queries };
  return { id: -999999 };
};

const getNextId = async () => {
  const last = await SiteLog.findOne().sort({ id: -1 }).select('id');
  return (last && typeof last.id === 'number') ? last.id + 1 : 1;
};

const parseTimeToMinutes = (t) => {
  if (!t && t !== 0) return null;
  const str = String(t).trim();
  const match12 = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match12) {
    let h = parseInt(match12[1], 10);
    const m = parseInt(match12[2], 10);
    const ampm = match12[3] ? match12[3].toUpperCase() : null;
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  }
  return null;
};

const calculateWorkingHours = (startTime, endTime, breakTime) => {
  const startM = parseTimeToMinutes(startTime);
  const endM = parseTimeToMinutes(endTime);
  const breakHrs = Number(breakTime) || 0;
  if (startM !== null && endM !== null) {
    let diffM = endM - startM;
    if (diffM < 0) diffM += 24 * 60; // support past midnight
    const spanHrs = diffM / 60;
    return Math.max(0, Number((spanHrs - breakHrs).toFixed(2)));
  }
  return 0;
};

const formatSiteLog = (doc) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  const startMeter = Number(obj.startMeterReading !== undefined ? obj.startMeterReading : (obj.startHours !== undefined ? obj.startHours : (obj.startReading || 0)));
  const endMeter = Number(obj.endMeterReading !== undefined ? obj.endMeterReading : (obj.endHours !== undefined ? obj.endHours : (obj.endReading || 0)));
  const runHours = Number(obj.totalRunHours !== undefined ? obj.totalRunHours : (obj.totalHours !== undefined ? obj.totalHours : Math.max(0, Number((endMeter - startMeter).toFixed(2)))));

  const startTime = obj.startTime || '09:00 AM';
  const endTime = obj.endTime || '06:00 PM';
  const breakTime = Number(obj.breakTime !== undefined ? obj.breakTime : 1.0);
  const workingHours = Number(obj.totalWorkingHours !== undefined ? obj.totalWorkingHours : calculateWorkingHours(startTime, endTime, breakTime));

  const diesel = Number(obj.dieselConsumed !== undefined ? obj.dieselConsumed : (obj.dieselFilledLiters || 0));
  const dateStr = obj.workDate || obj.date || new Date().toISOString().split('T')[0];

  return {
    ...obj,
    id: obj.id || obj._id,
    workDate: dateStr,
    date: dateStr,
    startTime,
    endTime,
    breakTime,
    totalWorkingHours: workingHours,
    startMeterReading: startMeter,
    endMeterReading: endMeter,
    totalRunHours: runHours,
    startHours: startMeter,
    startReading: startMeter,
    endHours: endMeter,
    endReading: endMeter,
    totalHours: runHours,
    dieselConsumed: diesel,
    dieselFilledLiters: diesel,
    status: obj.status || 'Working',
    siteLocation: obj.siteLocation || obj.workDescription || 'Main Project Site',
    workDescription: obj.workDescription || obj.siteLocation || 'Site operations and trenching'
  };
};

export const getSiteLogs = async (req, res) => {
  try {
    const filter = {};
    if (req.query.machineId) filter.machineId = Number(req.query.machineId);
    if (req.query.status && req.query.status !== 'ALL') filter.status = req.query.status;
    if (req.query.startDate && req.query.endDate) {
      filter.$or = [
        { workDate: { $gte: req.query.startDate, $lte: req.query.endDate } },
        { date: { $gte: req.query.startDate, $lte: req.query.endDate } }
      ];
    }

    const logs = await SiteLog.find(filter).sort({ workDate: -1, date: -1, id: -1 });
    res.json(logs.map(formatSiteLog));
  } catch (err) {
    console.error('Error fetching site logs:', err);
    res.status(500).json({ error: 'Failed to fetch site logs', details: err.message });
  }
};

export const getSiteLogById = async (req, res) => {
  try {
    const log = await SiteLog.findOne(safeIdQuery(req.params.id));
    if (!log) return res.status(404).json({ error: 'Site log not found' });
    res.json(formatSiteLog(log));
  } catch (err) {
    console.error('Error fetching site log:', err);
    res.status(500).json({ error: 'Failed to fetch site log', details: err.message });
  }
};

export const createSiteLog = async (req, res) => {
  try {
    const nextId = await getNextId();
    const data = { ...req.body };

    const startMeter = Number(data.startMeterReading !== undefined ? data.startMeterReading : (data.startHours !== undefined ? data.startHours : (data.startReading || 0)));
    const endMeter = Number(data.endMeterReading !== undefined ? data.endMeterReading : (data.endHours !== undefined ? data.endHours : (data.endReading || 0)));
    const runHours = Number(data.totalRunHours !== undefined ? data.totalRunHours : (data.totalHours !== undefined ? data.totalHours : Math.max(0, Number((endMeter - startMeter).toFixed(2)))));

    const startTime = data.startTime || '09:00 AM';
    const endTime = data.endTime || '06:00 PM';
    const breakTime = Number(data.breakTime !== undefined ? data.breakTime : 1.0);
    const workingHours = Number(data.totalWorkingHours !== undefined ? data.totalWorkingHours : calculateWorkingHours(startTime, endTime, breakTime));

    const diesel = Number(data.dieselConsumed !== undefined ? data.dieselConsumed : (data.dieselFilledLiters || 0));
    const dateStr = data.workDate || data.date || new Date().toISOString().split('T')[0];

    // If machine ID provided, ensure machineNumber is populated
    if (data.machineId && !data.machineNumber) {
      const m = await Machine.findOne(safeIdQuery(data.machineId));
      if (m) {
        data.machineNumber = m.plateNumber || m.regNumber || m.name;
      }
    }

    // If customer ID provided, ensure customerName is populated
    if (data.customerId && !data.customerName) {
      const c = await Customer.findOne(safeIdQuery(data.customerId));
      if (c) {
        data.customerName = c.name;
      }
    }

    const payload = {
      ...data,
      id: nextId,
      companyId: data.companyId || req.currentUser?.companyId || 1,
      branchId: data.branchId || req.currentUser?.branchId || 1,
      workDate: dateStr,
      date: dateStr,
      startTime,
      endTime,
      breakTime,
      totalWorkingHours: workingHours,
      startMeterReading: startMeter,
      endMeterReading: endMeter,
      totalRunHours: runHours,
      startHours: startMeter,
      startReading: startMeter,
      endHours: endMeter,
      endReading: endMeter,
      totalHours: runHours,
      dieselConsumed: diesel,
      dieselFilledLiters: diesel,
      status: data.status || 'Working'
    };

    const created = await SiteLog.create(payload);

    // Also update machine current meter reading / hours if end > current
    if (data.machineId && endMeter > 0) {
      await Machine.updateOne(
        safeIdQuery(data.machineId),
        { $max: { currentHours: endMeter, currentMeterReading: endMeter } }
      );
    }

    res.status(201).json(formatSiteLog(created));
  } catch (err) {
    console.error('Error creating site log:', err);
    res.status(500).json({ error: 'Failed to create site log', details: err.message });
  }
};

export const updateSiteLog = async (req, res) => {
  try {
    const log = await SiteLog.findOne(safeIdQuery(req.params.id));
    if (!log) return res.status(404).json({ error: 'Site log not found' });

    const data = { ...req.body };
    const startMeter = Number(data.startMeterReading !== undefined ? data.startMeterReading : (data.startHours !== undefined ? data.startHours : (data.startReading !== undefined ? data.startReading : (log.startMeterReading || log.startHours || 0))));
    const endMeter = Number(data.endMeterReading !== undefined ? data.endMeterReading : (data.endHours !== undefined ? data.endHours : (data.endReading !== undefined ? data.endReading : (log.endMeterReading || log.endHours || 0))));
    const runHours = Number(data.totalRunHours !== undefined ? data.totalRunHours : (data.totalHours !== undefined ? data.totalHours : Math.max(0, Number((endMeter - startMeter).toFixed(2)))));

    const startTime = data.startTime || log.startTime || '09:00 AM';
    const endTime = data.endTime || log.endTime || '06:00 PM';
    const breakTime = Number(data.breakTime !== undefined ? data.breakTime : (log.breakTime !== undefined ? log.breakTime : 1.0));
    const workingHours = Number(data.totalWorkingHours !== undefined ? data.totalWorkingHours : calculateWorkingHours(startTime, endTime, breakTime));

    const diesel = Number(data.dieselConsumed !== undefined ? data.dieselConsumed : (data.dieselFilledLiters !== undefined ? data.dieselFilledLiters : log.dieselConsumed));
    const dateStr = data.workDate || data.date || log.workDate;

    const payload = {
      ...data,
      workDate: dateStr,
      date: dateStr,
      startTime,
      endTime,
      breakTime,
      totalWorkingHours: workingHours,
      startMeterReading: startMeter,
      endMeterReading: endMeter,
      totalRunHours: runHours,
      startHours: startMeter,
      startReading: startMeter,
      endHours: endMeter,
      endReading: endMeter,
      totalHours: runHours,
      dieselConsumed: diesel,
      dieselFilledLiters: diesel
    };

    Object.assign(log, payload);
    await log.save();

    res.json(formatSiteLog(log));
  } catch (err) {
    console.error('Error updating site log:', err);
    res.status(500).json({ error: 'Failed to update site log', details: err.message });
  }
};

export const deleteSiteLog = async (req, res) => {
  try {
    const log = await SiteLog.findOne(safeIdQuery(req.params.id));
    if (!log) return res.status(404).json({ error: 'Site log not found' });

    await SiteLog.deleteOne({ _id: log._id });
    res.json({ success: true, message: 'Site log deleted successfully' });
  } catch (err) {
    console.error('Error deleting site log:', err);
    res.status(500).json({ error: 'Failed to delete site log', details: err.message });
  }
};

export default {
  getSiteLogs,
  getSiteLogById,
  createSiteLog,
  updateSiteLog,
  deleteSiteLog
};
