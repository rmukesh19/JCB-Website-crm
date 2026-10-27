import Machine from '../models/Machine.js';

const getNextId = async () => {
  const last = await Machine.findOne().sort({ id: -1 }).select('id');
  return (last && typeof last.id === 'number') ? last.id + 1 : 1;
};

const findMachineById = (id) => {
  if (id && String(id).length === 24) {
    return Machine.findOne({ $or: [{ _id: id }, { id: Number(id) || -1 }] });
  }
  const num = Number(id);
  if (!isNaN(num)) {
    return Machine.findOne({ $or: [{ id: num }, { _id: id }] });
  }
  return Machine.findOne({ _id: id });
};

const formatMachine = (m) => {
  const obj = m.toObject ? m.toObject() : m;
  const defaultPlate = obj.plateNumber || obj.regNumber || 'TN-30-BD-4492';
  const hourly = Number(obj.hourlyRate || obj.defaultRatePerHour || 1400);
  const daily = Number(obj.dailyRate || (hourly * 8));
  return {
    ...obj,
    id: obj.id || obj._id,
    companyId: Number(obj.companyId || 1),
    branchId: Number(obj.branchId || 1),
    name: obj.name || obj.modelName || 'JCB 3DX Super Eco',
    modelName: obj.modelName || obj.name || 'JCB 3DX Super Eco',
    plateNumber: defaultPlate.includes('-') ? defaultPlate : defaultPlate.replace(/\s+/g, '-'),
    regNumber: obj.regNumber || defaultPlate,
    chassisNumber: obj.chassisNumber || obj.chasisNumber || 'HAR3DX981249',
    currentHours: Number(obj.currentHours !== undefined ? obj.currentHours : (obj.currentMeterReading || 0)),
    currentMeterReading: Number(obj.currentMeterReading !== undefined ? obj.currentMeterReading : (obj.currentHours || 0)),
    nextServiceDueHours: Number(obj.nextServiceDueHours || 250),
    hourlyRate: hourly,
    defaultRatePerHour: hourly,
    dailyRate: daily,
    weeklyRate: Number(obj.weeklyRate || (daily * 6)),
    monthlyRate: Number(obj.monthlyRate || (daily * 25)),
    defaultRateWithDiesel: Number(obj.defaultRateWithDiesel || (hourly + 500)),
    status: obj.status || 'AVAILABLE'
  };
};

export const getMachines = async (req, res) => {
  try {
    const machines = await Machine.find().sort({ id: 1 });
    res.json(machines.map(formatMachine));
  } catch (err) {
    console.error('Error fetching machines:', err);
    res.status(500).json({ error: 'Failed to fetch machines', details: err.message });
  }
};

export const createMachine = async (req, res) => {
  try {
    const rawPlate = String(req.body.plateNumber || req.body.regNumber || '').trim().toUpperCase();
    const rawCode = String(req.body.code || '').trim().toUpperCase();

    if (rawPlate || rawCode) {
      const existing = await Machine.find();
      const duplicate = existing.find(m => {
        const mPlate = String(m.plateNumber || m.regNumber || '').trim().toUpperCase();
        const mCode = String(m.code || '').trim().toUpperCase();
        if (rawPlate && mPlate && rawPlate === mPlate) return true;
        if (rawCode && mCode && rawCode === mCode) return true;
        return false;
      });

      if (duplicate) {
        return res.status(400).json({
          error: `Duplicate Entry! A machine with registration/plate "${rawPlate || rawCode}" already exists (${duplicate.name || duplicate.code}).`,
          duplicate: true
        });
      }
    }

    const nextId = await getNextId();
    const formatted = formatMachine({
      ...req.body,
      id: nextId,
      companyId: req.body.companyId || req.currentUser?.companyId || 1,
      branchId: req.body.branchId || req.currentUser?.branchId || 1
    });

    const created = await Machine.create(formatted);
    res.status(201).json(formatMachine(created));
  } catch (err) {
    console.error('Error creating machine:', err);
    res.status(500).json({ error: 'Failed to create machine', details: err.message });
  }
};

export const updateMachine = async (req, res) => {
  try {
    const machine = await findMachineById(req.params.id);
    if (!machine) return res.status(404).json({ error: 'Machine not found' });

    const formatted = formatMachine({ ...machine.toObject(), ...req.body });
    Object.assign(machine, formatted);
    await machine.save();

    res.json(formatMachine(machine));
  } catch (err) {
    console.error('Error updating machine:', err);
    res.status(500).json({ error: 'Failed to update machine', details: err.message });
  }
};

export const deleteMachine = async (req, res) => {
  try {
    const machine = await findMachineById(req.params.id);
    if (!machine) return res.status(404).json({ error: 'Machine not found' });

    await Machine.deleteOne({ _id: machine._id });
    res.json({ success: true, message: 'Machine removed' });
  } catch (err) {
    console.error('Error deleting machine:', err);
    res.status(500).json({ error: 'Failed to delete machine', details: err.message });
  }
};
