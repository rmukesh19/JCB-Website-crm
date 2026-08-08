import express from 'express';
import { getEmployees, createEmployee, getAttendance, markAttendance, getSalarySlips, generateSalarySlip } from '../controllers/employeeController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getEmployees);
router.post('/', verifyToken, createEmployee);
router.get('/attendance', verifyToken, getAttendance);
router.post('/attendance', verifyToken, markAttendance);
router.get('/salary-slips', verifyToken, getSalarySlips);
router.post('/salary-slips', verifyToken, generateSalarySlip);

export default router;
