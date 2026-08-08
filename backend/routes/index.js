import express from 'express';
import authRoutes from './authRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import machineRoutes from './machineRoutes.js';
import customerRoutes from './customerRoutes.js';
import crmRoutes from './crmRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import invoiceRoutes from './invoiceRoutes.js';
import accountRoutes from './accountRoutes.js';
import expenseRoutes from './expenseRoutes.js';
import employeeRoutes from './employeeRoutes.js';
import dieselRoutes from './dieselRoutes.js';
import maintenanceRoutes from './maintenanceRoutes.js';
import whatsappRoutes from './whatsappRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import reportsRoutes from './reportsRoutes.js';

import {
  getCompanies,
  updateCompany,
  getBranches,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getAuditLogs,
  getOperators,
  createOperator,
  updateOperator,
  deleteOperator,
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  getSpareParts,
  createSparePart,
  getSuppliers,
  createSupplier,
  getPurchases,
  createPurchase,
  getNotifications,
  markAllNotificationsRead
} from '../controllers/settingsController.js';
import { getTransactions } from '../controllers/accountController.js';
import { getDashboardMetrics } from '../controllers/dashboardController.js';
import { getFinancialReport, getMachineUtilizationReport } from '../controllers/reportsController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/machines', machineRoutes);
router.use('/customers', customerRoutes);
router.use('/crm', crmRoutes);
router.use('/bookings', bookingRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/accounts', accountRoutes);
router.use('/expenses', expenseRoutes);
router.use('/employees', employeeRoutes);
router.use('/diesel', dieselRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/whatsapp', whatsappRoutes);
router.use('/settings', settingsRoutes);
router.use('/reports', reportsRoutes);

// Bug 4 Fix: Route path aliases — support both old (mismatched) and canonical paths
// /api/dashboard → /api/dashboard/metrics
router.get('/dashboard', verifyToken, getDashboardMetrics);
// /api/reports/summary → /api/reports/financial
router.get('/reports/summary', verifyToken, getFinancialReport);
// /api/reports/machine-utilization alias
router.get('/reports/machine-utilization', verifyToken, getMachineUtilizationReport);
// /api/settings/company (singular) → /api/settings/companies
router.get('/settings/company', verifyToken, getCompanies);
router.put('/settings/company/:id', verifyToken, updateCompany);

// Direct top-level endpoint aliases used by frontend
router.get('/companies', verifyToken, getCompanies);
router.put('/companies/:id', verifyToken, updateCompany);
router.get('/branches', verifyToken, getBranches);
router.get('/users', verifyToken, getUsers);
router.post('/users', verifyToken, createUser);
router.put('/users/:id', verifyToken, updateUser);
router.delete('/users/:id', verifyToken, deleteUser);
router.get('/audit-logs', verifyToken, getAuditLogs);

router.get('/operators', verifyToken, getOperators);
router.post('/operators', verifyToken, createOperator);
router.put('/operators/:id', verifyToken, updateOperator);
router.delete('/operators/:id', verifyToken, deleteOperator);

router.get('/drivers', verifyToken, getDrivers);
router.post('/drivers', verifyToken, createDriver);
router.put('/drivers/:id', verifyToken, updateDriver);
router.delete('/drivers/:id', verifyToken, deleteDriver);

router.get('/spare-parts', verifyToken, getSpareParts);
router.post('/spare-parts', verifyToken, createSparePart);

router.get('/suppliers', verifyToken, getSuppliers);
router.post('/suppliers', verifyToken, createSupplier);

router.get('/purchases', verifyToken, getPurchases);
router.post('/purchases', verifyToken, createPurchase);

router.get('/notifications', verifyToken, getNotifications);
router.post('/notifications/read-all', verifyToken, markAllNotificationsRead);

router.get('/transactions', verifyToken, getTransactions);

export default router;

