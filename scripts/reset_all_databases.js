import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { resetDatabase, saveDbSync } from '../backend/services/fileDb.js';

dotenv.config({ path: path.join(process.cwd(), '.env') });
dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });

async function resetAllDatabases() {
  console.log('=====================================================');
  console.log('      ENTERPRISE DATABASE DROP & RESET ENGINE        ');
  console.log('=====================================================');

  // 1. Attempt MongoDB Instance Connection & Drop
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri && mongoUri.startsWith('mongodb')) {
    console.log('[MongoDB] Checking MongoDB connection string...');
    try {
      const conn = await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
      console.log(`[MongoDB] Connected successfully to: ${conn.connection.name}`);
      
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`[MongoDB] Found ${collections.length} collections to drop:`, collections.map(c => c.name));

      for (const col of collections) {
        await mongoose.connection.db.dropCollection(col.name);
        console.log(`[MongoDB] Dropped collection: ${col.name}`);
      }
      console.log('[MongoDB] All collections dropped cleanly in MongoDB instance.');
      await mongoose.disconnect();
    } catch (mongoErr) {
      console.warn(`[MongoDB] Note: External MongoDB cluster not reachable (${mongoErr.message}).`);
      console.log('[MongoDB] Proceeding with Primary FileDB/JSON Database Engine.');
    }
  }

  // 2. Perform Complete Reset of FileDB Instance (All Collections)
  console.log('\n[FileDB] Wiping and resetting all collections to pristine enterprise state...');
  const resetDb = resetDatabase();
  saveDbSync();

  // 3. Remove any stale backup caches
  const dataDir = path.join(process.cwd(), 'data');
  const backupFile = path.join(dataDir, 'db.backup.json');
  if (fs.existsSync(backupFile)) {
    fs.unlinkSync(backupFile);
    console.log('[FileDB] Removed stale db.backup.json cache.');
  }

  // 4. Print Status of Wiped & Initialized Collections
  console.log('\n--- Collection Status After Wipe & Reset ---');
  for (const [key, val] of Object.entries(resetDb)) {
    if (Array.isArray(val)) {
      console.log(` - ${key}: ${val.length} records`);
    }
  }

  console.log('\n[SUCCESS] Complete database reset executed across all collections.');
}

resetAllDatabases()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[ERROR] Database wipe failed:', err);
    process.exit(1);
  });
