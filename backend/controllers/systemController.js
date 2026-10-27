import { resetDatabase } from '../services/memoryStore.js';

export const resetSystemDatabase = async (req, res) => {
  resetDatabase();
  res.json({ success: true, message: 'Production Database Reset Completed Successfully' });
};
