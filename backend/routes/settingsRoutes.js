import express from 'express';
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
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/company', verifyToken, getCompanies);
router.put('/company/:id', verifyToken, updateCompany);
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

export default router;
