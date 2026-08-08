import Machine from '../models/Machine.js';
import logAudit from '../services/auditService.js';
import { isDbConnected, memoryStore } from '../services/memoryStore.js';

export const getMachines = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const machines = await Machine.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(machines);
      } catch (dbErr) {
        console.warn('getMachines DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.machines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMachine = async (req, res) => {
  try {
    let newMachine;
    if (isDbConnected()) {
      try {
        const count = await Machine.countDocuments();
        const id = count + 1;
        newMachine = new Machine({
          id,
          companyId: req.currentUser?.companyId || 1,
          branchId: req.currentUser?.branchId || 1,
          status: 'AVAILABLE',
          currentHours: 0,
          name: req.body.name || req.body.modelName || 'JCB Equipment',
          modelName: req.body.modelName || req.body.name || 'JCB Equipment',
          ...req.body
        });
        await newMachine.save();
      } catch (dbErr) {
        console.warn('createMachine DB fallback:', dbErr.message);
      }
    }

    if (!newMachine) {
      const id = memoryStore.machines.length + 1;
      newMachine = {
        id,
        companyId: req.currentUser?.companyId || 1,
        branchId: req.currentUser?.branchId || 1,
        status: 'AVAILABLE',
        currentHours: 0,
        ...req.body
      };
      memoryStore.machines.push(newMachine);
    }

    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'CREATE_MACHINE', `Added JCB Machine ${newMachine.modelName} (${newMachine.plateNumber})`);
    return res.json(newMachine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMachine = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let updated = null;
    if (isDbConnected()) {
      try {
        updated = await Machine.findOneAndUpdate({ id }, req.body, { new: true });
      } catch (dbErr) {
        console.warn('updateMachine DB fallback:', dbErr.message);
      }
    }

    if (!updated) {
      const idx = memoryStore.machines.findIndex(m => m.id === id);
      if (idx !== -1) {
        memoryStore.machines[idx] = { ...memoryStore.machines[idx], ...req.body };
        updated = memoryStore.machines[idx];
      }
    }

    if (!updated) return res.status(404).json({ error: 'Machine not found' });
    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'UPDATE_MACHINE', `Updated JCB Machine ${updated.plateNumber}`);
    return res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMachine = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let deleted = null;
    if (isDbConnected()) {
      try {
        deleted = await Machine.findOneAndDelete({ id });
      } catch (dbErr) {
        console.warn('deleteMachine DB fallback:', dbErr.message);
      }
    }

    if (!deleted) {
      const idx = memoryStore.machines.findIndex(m => m.id === id);
      if (idx !== -1) {
        deleted = memoryStore.machines[idx];
        memoryStore.machines.splice(idx, 1);
      }
    }

    if (!deleted) return res.status(404).json({ error: 'Machine not found' });
    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'DELETE_MACHINE', `Deleted JCB Machine ${deleted.plateNumber}`);
    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
