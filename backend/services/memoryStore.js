// JCB360 File-Based Database Bridge (Zero External DB Dependency)
// Points all legacy memoryStore imports directly to backend/services/fileDb.js with full local persistence to /data/db.json

import { db, resetDatabase, saveDb, createModel, getInitialData } from './fileDb.js';

export { db, resetDatabase, saveDb, createModel, getInitialData };
export default db;
