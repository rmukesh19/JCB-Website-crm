import DieselRecord from '../models/DieselRecord.js';
import Machine from '../models/Machine.js';
import Expense from '../models/Expense.js';

const getNextId = async (Model) => {
  const last = await Model.findOne().sort({ id: -1 }).select('id');
  return (last && typeof last.id === 'number') ? last.id + 1 : 1;
};

const formatDieselRecord = (d) => {
  const obj = d.toObject ? d.toObject() : d;
  const dt = obj.fillDate || obj.date || new Date().toISOString();
  const dateStr = dt.includes('T') ? dt.split('T')[0] : dt;
  const fillDateIso = dt.includes('T') ? dt : `${dateStr}T10:00:00.000Z`;
  const cost = Number(obj.totalCost !== undefined ? obj.totalCost : (obj.totalAmount || (Number(obj.quantityLiters || 0) * Number(obj.ratePerLiter || 92.5))));
  const reading = Number(obj.currentHours !== undefined ? obj.currentHours : (obj.meterReading || 0));

  return {
    ...obj,
    id: obj.id || obj._id,
    date: dateStr,
    fillDate: fillDateIso,
    totalCost: cost,
    totalAmount: cost,
    currentHours: reading,
    meterReading: reading,
    slipNumber: obj.slipNumber || `SLIP-${obj.id || 1000}`,
    paymentMode: obj.paymentMode || 'BANK'
  };
};

export const getDieselRecords = async (req, res) => {
  try {
    const records = await DieselRecord.find().sort({ id: -1 });
    res.json(records.map(formatDieselRecord));
  } catch (err) {
    console.error('Error fetching diesel records:', err);
    res.status(500).json({ error: 'Failed to fetch diesel records', details: err.message });
  }
};

export const createDieselRecord = async (req, res) => {
  try {
    const nextId = await getNextId(DieselRecord);
    const quantity = Number(req.body.quantityLiters || req.body.liters || 0);
    const rate = Number(req.body.ratePerLiter || 92.5);
    const totalAmount = Number(req.body.totalAmount || req.body.totalCost || (quantity * rate));
    const dateVal = req.body.date || req.body.fillDate || new Date().toISOString().split('T')[0];

    const recData = formatDieselRecord({
      ...req.body,
      id: nextId,
      companyId: req.body.companyId || req.currentUser?.companyId || 1,
      branchId: req.body.branchId || req.currentUser?.branchId || 1,
      date: dateVal.includes('T') ? dateVal.split('T')[0] : dateVal,
      fillDate: dateVal.includes('T') ? dateVal : `${dateVal}T10:00:00.000Z`,
      quantityLiters: quantity,
      ratePerLiter: rate,
      totalAmount,
      totalCost: totalAmount
    });

    const newRecord = await DieselRecord.create(recData);

    // Update machine meter reading if provided
    if (recData.machineId && recData.meterReading) {
      const m = await Machine.findOne({ $or: [{ id: Number(recData.machineId) }, { _id: recData.machineId }] });
      if (m && Number(recData.meterReading) > Number(m.currentMeterReading || 0)) {
        m.currentMeterReading = Number(recData.meterReading);
        m.currentHours = Number(recData.meterReading);
        await m.save();
      }
    }

    // Also record in expenses
    const nextExpId = await getNextId(Expense);
    await Expense.create({
      id: nextExpId,
      companyId: recData.companyId,
      branchId: recData.branchId,
      machineId: recData.machineId,
      category: 'DIESEL',
      amount: totalAmount,
      description: `Diesel refill ${quantity}L for ${recData.machineCode || 'machine'}`,
      date: recData.date,
      vendor: recData.vendor || 'Fuel Pump'
    });

    res.status(201).json(formatDieselRecord(newRecord));
  } catch (err) {
    console.error('Error creating diesel record:', err);
    res.status(500).json({ error: 'Failed to create diesel record', details: err.message });
  }
};
