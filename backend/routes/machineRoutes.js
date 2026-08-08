import express from 'express';
import { getMachines, createMachine, updateMachine, deleteMachine } from '../controllers/machineController.js';
import { verifyToken } from '../middleware/auth.js';
import { validateMachine } from '../validators/inputValidator.js';

const router = express.Router();

router.get('/', verifyToken, getMachines);
router.post('/', verifyToken, validateMachine, createMachine);
router.put('/:id', verifyToken, updateMachine);
router.delete('/:id', verifyToken, deleteMachine);

export default router;
