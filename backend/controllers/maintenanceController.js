import db from '../services/memoryStore.js';

export const getMaintenanceRecords = async (req, res) => res.json(db.maintenanceRecords);

export const createMaintenanceRecord = async (req, res) => {
  const cost = Number(req.body.cost || req.body.totalCost || 0);
  const rec = {
    id: db.maintenanceRecords.length > 0 ? Math.max(...db.maintenanceRecords.map(m => m.id)) + 1 : 1,
    companyId: req.body.companyId || req.currentUser?.companyId || 1,
    branchId: req.body.branchId || req.currentUser?.branchId || 1,
    serviceDate: req.body.serviceDate || new Date().toISOString().split('T')[0],
    cost,
    status: 'COMPLETED',
    ...req.body
  };
  db.maintenanceRecords.push(rec);

  // Record in expenses
  db.expenses.push({
    id: db.expenses.length + 1,
    companyId: rec.companyId,
    branchId: rec.branchId,
    machineId: rec.machineId,
    category: 'MAINTENANCE',
    amount: cost,
    description: `Maintenance ${rec.serviceType || 'Service'} for ${rec.machineCode || 'machine'}`,
    date: rec.serviceDate,
    vendor: rec.serviceCenter || 'Service Station'
  });

  res.status(201).json(rec);
};
