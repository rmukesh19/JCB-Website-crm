import Employee from '../models/Employee.js';
import Attendance from '../models/Attendance.js';
import SalarySlip from '../models/SalarySlip.js';
import { isDbConnected, memoryStore } from '../services/memoryStore.js';

export const getEmployees = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const employees = await Employee.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(employees);
      } catch (dbErr) {
        console.warn('getEmployees DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    let emp = null;
    if (isDbConnected()) {
      try {
        const count = await Employee.countDocuments();
        const id = count + 1;
        emp = new Employee({
          id,
          companyId: req.currentUser?.companyId || 1,
          branchId: req.currentUser?.branchId || 1,
          ...req.body
        });
        await emp.save();
      } catch (dbErr) {
        console.warn('createEmployee DB fallback:', dbErr.message);
      }
    }

    if (!emp) {
      const id = memoryStore.employees.length + 1;
      emp = {
        id,
        companyId: req.currentUser?.companyId || 1,
        branchId: req.currentUser?.branchId || 1,
        ...req.body
      };
      memoryStore.employees.push(emp);
    }

    return res.json(emp);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAttendance = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const records = await Attendance.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(records);
      } catch (dbErr) {
        console.warn('getAttendance DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    let record = null;
    if (isDbConnected()) {
      try {
        const count = await Attendance.countDocuments();
        const id = count + 1;
        record = new Attendance({
          id,
          companyId: req.currentUser?.companyId || 1,
          date: new Date().toISOString().split('T')[0],
          ...req.body
        });
        await record.save();
      } catch (dbErr) {
        console.warn('markAttendance DB fallback:', dbErr.message);
      }
    }

    if (!record) {
      const id = memoryStore.attendance.length + 1;
      record = {
        id,
        companyId: req.currentUser?.companyId || 1,
        date: new Date().toISOString().split('T')[0],
        ...req.body
      };
      memoryStore.attendance.push(record);
    }

    return res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSalarySlips = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const slips = await SalarySlip.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(slips);
      } catch (dbErr) {
        console.warn('getSalarySlips DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.salarySlips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const generateSalarySlip = async (req, res) => {
  try {
    let slip = null;
    if (isDbConnected()) {
      try {
        const count = await SalarySlip.countDocuments();
        const id = count + 1;
        slip = new SalarySlip({
          id,
          companyId: req.currentUser?.companyId || 1,
          ...req.body
        });
        await slip.save();
      } catch (dbErr) {
        console.warn('generateSalarySlip DB fallback:', dbErr.message);
      }
    }

    if (!slip) {
      const id = memoryStore.salarySlips.length + 1;
      slip = {
        id,
        companyId: req.currentUser?.companyId || 1,
        ...req.body
      };
      memoryStore.salarySlips.push(slip);
    }

    return res.json(slip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
