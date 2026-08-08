import DieselRecord from '../models/DieselRecord.js';
import Machine from '../models/Machine.js';
import { isDbConnected, memoryStore } from '../services/memoryStore.js';

export const getDieselRecords = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const records = await DieselRecord.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(records);
      } catch (dbErr) {
        console.warn('getDieselRecords DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.dieselRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDieselRecord = async (req, res) => {
  try {
    let record = null;
    const totalCost = parseFloat(req.body.quantityLiters || 0) * parseFloat(req.body.ratePerLiter || 0);

    if (isDbConnected()) {
      try {
        const count = await DieselRecord.countDocuments();
        const id = count + 1;
        record = new DieselRecord({
          id,
          companyId: req.currentUser?.companyId || 1,
          branchId: req.currentUser?.branchId || 1,
          fillDate: new Date().toISOString(),
          totalCost,
          ...req.body
        });
        await record.save();
        await Machine.findOneAndUpdate({ id: record.machineId }, { currentHours: record.currentHours });
      } catch (dbErr) {
        console.warn('createDieselRecord DB fallback:', dbErr.message);
      }
    }

    if (!record) {
      const id = memoryStore.dieselRecords.length + 1;
      record = {
        id,
        companyId: req.currentUser?.companyId || 1,
        branchId: req.currentUser?.branchId || 1,
        fillDate: new Date().toISOString(),
        totalCost,
        ...req.body
      };
      memoryStore.dieselRecords.push(record);

      const m = memoryStore.machines.find(x => x.id === record.machineId);
      if (m) m.currentHours = record.currentHours;
    }

    return res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
