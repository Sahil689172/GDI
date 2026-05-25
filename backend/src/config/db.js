import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  mongoose.set('strictQuery', true);

  const conn = await mongoose.connect(env.mongodbUri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log(`[mongodb] Connected: ${conn.connection.host}`);
  return conn;
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('[mongodb] Disconnected');
};
