import MaintenanceRecord from '../models/MaintenanceRecord.js';
import Machine from '../models/Machine.js';
import { isDbConnected, memoryStore } from '../services/memoryStore.js';

export const getMaintenanceRecords = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const records = await MaintenanceRecord.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(records);
      } catch (dbErr) {
        console.warn('getMaintenanceRecords DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.maintenanceRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMaintenanceRecord = async (req, res) => {
  try {
    let record = null;
    if (isDbConnected()) {
      try {
        const count = await MaintenanceRecord.countDocuments();
        const id = count + 1;
        record = new MaintenanceRecord({
          id,
          companyId: req.currentUser?.companyId || 1,
          branchId: req.currentUser?.branchId || 1,
          serviceDate: new Date().toISOString().split('T')[0],
          ...req.body
        });
        await record.save();

        await Machine.findOneAndUpdate({ id: record.machineId }, {
          lastServiceDate: record.serviceDate,
          status: 'AVAILABLE'
        });
      } catch (dbErr) {
        console.warn('createMaintenanceRecord DB fallback:', dbErr.message);
      }
    }

    if (!record) {
      const id = memoryStore.maintenanceRecords.length + 1;
      record = {
        id,
        companyId: req.currentUser?.companyId || 1,
        branchId: req.currentUser?.branchId || 1,
        serviceDate: new Date().toISOString().split('T')[0],
        ...req.body
      };
      memoryStore.maintenanceRecords.push(record);

      const m = memoryStore.machines.find(x => x.id === record.machineId);
      if (m) {
        m.lastServiceDate = record.serviceDate;
        m.status = 'AVAILABLE';
      }
    }

    return res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
