import mongoose from 'mongoose';
import { env } from './env.js';

/** Hide credentials when logging connection strings */
export const maskMongoUri = (uri) => {
  if (!uri) return '(not set)';
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
};

const connectionOptions = {
  serverSelectionTimeoutMS: env.isProd ? 15000 : 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: env.isProd ? 20 : 10,
  minPoolSize: env.isProd ? 2 : 0,
  retryWrites: true,
  w: 'majority',
};

const formatConnectionError = (err) => {
  const name = err.name || 'Error';
  const message = err.message || 'Unknown database error';

  if (name === 'MongoServerSelectionError') {
    return [
      'Could not reach MongoDB.',
      'Atlas checklist:',
      '  • Is your cluster running (not paused)?',
      '  • Is your IP whitelisted under Network Access (or 0.0.0.0/0 for dev)?',
      '  • Is MONGODB_URI correct in backend/.env?',
      `Details: ${message}`,
    ].join('\n');
  }

  if (name === 'MongoAuthenticationError' || message.includes('Authentication failed')) {
    return [
      'MongoDB authentication failed.',
      '  • Check database username/password in MONGODB_URI',
      '  • Confirm user has read/write on the database',
      `Details: ${message}`,
    ].join('\n');
  }

  if (message.includes('ENOTFOUND') || message.includes('querySrv')) {
    return [
      'Invalid MongoDB host or SRV record.',
      '  • Copy the connection string again from Atlas → Connect → Drivers',
      '  • Use mongodb+srv:// for Atlas clusters',
      `Details: ${message}`,
    ].join('\n');
  }

  return `${name}: ${message}`;
};

const registerConnectionEvents = () => {
  mongoose.connection.on('connected', () => {
    const { host, name } = mongoose.connection;
    console.log(`[mongodb] Connected → host: ${host}, database: ${name}`);
  });

  mongoose.connection.on('error', (err) => {
    console.error('[mongodb] Connection error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[mongodb] Disconnected');
  });
};

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  mongoose.set('strictQuery', true);
  registerConnectionEvents();

  const uri = env.mongodbUri;
  console.log(`[mongodb] Connecting to ${maskMongoUri(uri)} (${env.nodeEnv})`);

  try {
    await mongoose.connect(uri, connectionOptions);
    return mongoose.connection;
  } catch (err) {
    console.error(formatConnectionError(err));
    throw err;
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
  console.log('[mongodb] Disconnected gracefully');
};

export const getDbHealth = () => {
  const state = mongoose.connection.readyState;
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return {
    status: state === 1 ? 'ok' : 'down',
    readyState: state,
    readyStateLabel: states[state] ?? 'unknown',
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
    isAtlas: env.mongodbUri.includes('mongodb.net'),
  };
};
