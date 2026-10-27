import db from '../services/memoryStore.js';

export const getEmployees = async (req, res) => res.json(db.employees);

export const createEmployee = async (req, res) => {
  const emp = {
    id: db.employees.length > 0 ? Math.max(...db.employees.map(e => e.id)) + 1 : 1,
    companyId: req.body.companyId || req.currentUser?.companyId || 1,
    branchId: req.body.branchId || req.currentUser?.branchId || 1,
    status: 'ACTIVE',
    ...req.body
  };
  db.employees.push(emp);
  res.status(201).json(emp);
};

export const getAttendance = async (req, res) => res.json(db.attendance);

export const markAttendance = async (req, res) => {
  // If array of attendance records sent
  if (Array.isArray(req.body)) {
    req.body.forEach(item => {
      db.attendance.push({
        id: db.attendance.length + 1,
        companyId: req.currentUser?.companyId || 1,
        branchId: req.currentUser?.branchId || 1,
        date: item.date || new Date().toISOString().split('T')[0],
        status: item.status || 'PRESENT',
        ...item
      });
    });
    return res.status(201).json({ success: true, count: req.body.length });
  }

  const att = {
    id: db.attendance.length + 1,
    companyId: req.body.companyId || req.currentUser?.companyId || 1,
    branchId: req.body.branchId || req.currentUser?.branchId || 1,
    date: req.body.date || new Date().toISOString().split('T')[0],
    status: req.body.status || 'PRESENT',
    ...req.body
  };
  db.attendance.push(att);
  res.status(201).json(att);
};

export const getSalarySlips = async (req, res) => res.json(db.salarySlips);

export const generateSalarySlip = async (req, res) => {
  const slip = {
    id: db.salarySlips.length > 0 ? Math.max(...db.salarySlips.map(s => s.id)) + 1 : 1,
    companyId: req.body.companyId || req.currentUser?.companyId || 1,
    branchId: req.body.branchId || req.currentUser?.branchId || 1,
    status: 'PAID',
    paymentDate: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.salarySlips.push(slip);
  res.status(201).json(slip);
};

export const deleteSalarySlip = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  db.salarySlips = db.salarySlips.filter(s => s.id !== id);
  res.json({ success: true });
};
