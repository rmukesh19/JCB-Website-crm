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
import siteLogRoutes from './siteLogRoutes.js';

import {
  getCompanies,
  updateCompany,
  getBranches,
  createBranch,
  updateBranch,
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
  updateSparePart,
  deleteSparePart,
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getRates,
  createRate,
  updateRate,
  deleteRate,
  getPurchases,
  createPurchase,
  getNotifications,
  markAllNotificationsRead
} from '../controllers/settingsController.js';

import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../controllers/accountController.js';
import { getAttendance, markAttendance, getSalarySlips, generateSalarySlip, deleteSalarySlip } from '../controllers/employeeController.js';
import { getRolesPermissions, updateRolePermissions } from '../controllers/roleController.js';
import { resetSystemDatabase } from '../controllers/systemController.js';
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
router.use('/site-logs', siteLogRoutes);
router.use('/sitelogs', siteLogRoutes);

// Direct top-level endpoint aliases used by frontend
router.get('/companies', verifyToken, getCompanies);
router.put('/companies/:id', verifyToken, updateCompany);

router.get('/branches', verifyToken, getBranches);
router.post('/branches', verifyToken, createBranch);
router.put('/branches/:id', verifyToken, updateBranch);

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
router.put('/spare-parts/:id', verifyToken, updateSparePart);
router.delete('/spare-parts/:id', verifyToken, deleteSparePart);

router.get('/suppliers', verifyToken, getSuppliers);
router.post('/suppliers', verifyToken, createSupplier);
router.put('/suppliers/:id', verifyToken, updateSupplier);
router.delete('/suppliers/:id', verifyToken, deleteSupplier);

router.get('/rates', verifyToken, getRates);
router.post('/rates', verifyToken, createRate);
router.put('/rates/:id', verifyToken, updateRate);
router.delete('/rates/:id', verifyToken, deleteRate);

router.get('/purchases', verifyToken, getPurchases);
router.post('/purchases', verifyToken, createPurchase);

router.get('/notifications', verifyToken, getNotifications);
router.post('/notifications/read-all', verifyToken, markAllNotificationsRead);

router.get('/transactions', verifyToken, getTransactions);
router.post('/transactions', verifyToken, createTransaction);
router.put('/transactions/:id', verifyToken, updateTransaction);
router.delete('/transactions/:id', verifyToken, deleteTransaction);

router.get('/attendance', verifyToken, getAttendance);
router.post('/attendance', verifyToken, markAttendance);

router.get('/salaries', verifyToken, getSalarySlips);
router.post('/salaries', verifyToken, generateSalarySlip);
router.delete('/salaries/:id', verifyToken, deleteSalarySlip);

router.get('/roles/permissions', verifyToken, getRolesPermissions);
router.post('/roles/permissions', verifyToken, updateRolePermissions);

router.post('/system/reset-database', verifyToken, resetSystemDatabase);

export default router;
