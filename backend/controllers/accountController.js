import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import logAudit from '../services/auditService.js';
import { isDbConnected, memoryStore } from '../services/memoryStore.js';

export const getAccounts = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const accounts = await Account.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(accounts);
      } catch (dbErr) {
        console.warn('getAccounts DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createAccount = async (req, res) => {
  try {
    let newAcc = null;
    if (isDbConnected()) {
      try {
        const count = await Account.countDocuments();
        const id = count + 1;
        newAcc = new Account({
          id,
          companyId: req.currentUser?.companyId || 1,
          code: String(1000 + id),
          ...req.body
        });
        await newAcc.save();
      } catch (dbErr) {
        console.warn('createAccount DB fallback:', dbErr.message);
      }
    }

    if (!newAcc) {
      const id = memoryStore.accounts.length + 1;
      newAcc = {
        id,
        companyId: req.currentUser?.companyId || 1,
        code: String(1000 + id),
        ...req.body
      };
      memoryStore.accounts.push(newAcc);
    }

    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'CREATE_ACCOUNT', `Created account ${newAcc.name}`);
    return res.json(newAcc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let updated = null;
    if (isDbConnected()) {
      try {
        updated = await Account.findOneAndUpdate({ id }, req.body, { new: true });
      } catch (dbErr) {
        console.warn('updateAccount DB fallback:', dbErr.message);
      }
    }

    if (!updated) {
      const idx = memoryStore.accounts.findIndex(a => a.id === id);
      if (idx !== -1) {
        memoryStore.accounts[idx] = { ...memoryStore.accounts[idx], ...req.body };
        updated = memoryStore.accounts[idx];
      }
    }

    if (!updated) return res.status(404).json({ error: 'Account not found' });
    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'UPDATE_ACCOUNT', `Updated account ${updated.name}`);
    return res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    let deleted = null;
    if (isDbConnected()) {
      try {
        deleted = await Account.findOneAndDelete({ id });
      } catch (dbErr) {
        console.warn('deleteAccount DB fallback:', dbErr.message);
      }
    }

    if (!deleted) {
      const idx = memoryStore.accounts.findIndex(a => a.id === id);
      if (idx !== -1) {
        deleted = memoryStore.accounts[idx];
        memoryStore.accounts.splice(idx, 1);
      }
    }

    if (!deleted) return res.status(404).json({ error: 'Account not found' });
    await logAudit(req.currentUser?.companyId, req.currentUser?.id, req.currentUser?.name, 'DELETE_ACCOUNT', `Deleted account ${deleted.name}`);
    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    if (isDbConnected()) {
      try {
        const transactions = await Transaction.find({ companyId: req.currentUser?.companyId || 1 });
        return res.json(transactions);
      } catch (dbErr) {
        console.warn('getTransactions DB fallback:', dbErr.message);
      }
    }
    return res.json(memoryStore.transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const postJournalTransaction = async (req, res) => {
  try {
    let trans = null;
    const { date, referenceNumber, description, lines, type } = req.body;

    if (isDbConnected()) {
      try {
        const count = await Transaction.countDocuments();
        const id = count + 1;
        trans = new Transaction({
          id,
          companyId: req.currentUser?.companyId || 1,
          branchId: req.currentUser?.branchId || 1,
          transactionDate: date || new Date().toISOString().split('T')[0],
          referenceNumber,
          description,
          type: type || 'JOURNAL',
          lines
        });
        await trans.save();
      } catch (dbErr) {
        console.warn('postJournalTransaction DB fallback:', dbErr.message);
      }
    }

    if (!trans) {
      const id = memoryStore.transactions.length + 1;
      trans = {
        id,
        companyId: req.currentUser?.companyId || 1,
        branchId: req.currentUser?.branchId || 1,
        transactionDate: date || new Date().toISOString().split('T')[0],
        referenceNumber,
        description,
        type: type || 'JOURNAL',
        lines
      };
      memoryStore.transactions.push(trans);
    }

    return res.json({ success: true, transaction: trans });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
