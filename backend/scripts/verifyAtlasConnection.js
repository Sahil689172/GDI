/**
 * Verifies MongoDB / Atlas connectivity and lists collections + document counts.
 * Usage: npm run db:verify
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const maskUri = (uri) => uri?.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@') ?? '(not set)';

const uri = process.env.MONGODB_URI?.trim();
if (!uri) {
  console.error('❌ MONGODB_URI is not set in backend/.env');
  process.exit(1);
}

const isAtlas = uri.includes('mongodb.net');

console.log('\n--- Gotta-do-it MongoDB verification ---\n');
console.log('URI:', maskUri(uri));
console.log('Target:', isAtlas ? 'MongoDB Atlas (cloud)' : 'Local / custom host');
console.log('');

try {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    retryWrites: true,
    w: 'majority',
  });

  const { host, name, readyState } = mongoose.connection;
  console.log('✅ Connection successful');
  console.log(`   Host: ${host}`);
  console.log(`   Database: ${name}`);
  console.log(`   Ready state: ${readyState} (1 = connected)\n`);

  const collections = await mongoose.connection.db.listCollections().toArray();
  const expected = ['users', 'workspaces', 'tasks'];
  const names = collections.map((c) => c.name).sort();

  console.log('Collections:', names.length ? names.join(', ') : '(none yet)');
  console.log('');

  for (const collName of [...new Set([...expected, ...names])]) {
    if (!names.includes(collName) && expected.includes(collName)) {
      console.log(`   ${collName}: 0 documents (collection not created yet)`);
      continue;
    }
    if (!names.includes(collName)) continue;
    const count = await mongoose.connection.db.collection(collName).countDocuments();
    console.log(`   ${collName}: ${count} document(s)`);
  }

  console.log('\n✅ Atlas/local database is reachable and ready.\n');
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error('❌ Connection failed\n');
  console.error(err.message);
  if (isAtlas) {
    console.error('\nAtlas tips:');
    console.error('  1. Network Access → Add IP Address (your IP or 0.0.0.0/0 for dev)');
    console.error('  2. Database Access → user exists with password');
    console.error('  3. URI uses mongodb+srv:// and correct database name');
    console.error('  4. Cluster is not paused\n');
  }
  process.exit(1);
}
