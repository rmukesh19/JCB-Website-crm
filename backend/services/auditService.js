import AuditLog from '../models/AuditLog.js';
import { isDbConnected, memoryStore } from './memoryStore.js';

export const logAudit = async (companyId, userId, userName, action, details) => {
  try {
    const logData = {
      id: Date.now(),
      companyId: companyId || 1,
      userId: userId || 1,
      userName: userName || 'System Admin',
      action,
      details,
      ipAddress: '127.0.0.1',
      createdAt: new Date()
    };

    if (isDbConnected()) {
      try {
        const log = new AuditLog(logData);
        await log.save();
        return;
      } catch (dbErr) {
        console.warn('Failed to write DB audit log:', dbErr.message);
      }
    }

    // Fallback to in-memory store
    memoryStore.auditLogs.unshift(logData);
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
};

export default logAudit;
