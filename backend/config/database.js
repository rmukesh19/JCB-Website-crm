import { initFileDb, resetDatabase } from '../services/fileDb.js';

export const connectDB = async () => {
  return initFileDb();
};

export const seedDatabase = async () => {
  return resetDatabase();
};

export default connectDB;
