import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const localDefaultUri = 'mongodb://127.0.0.1:27017/gotta-do-it';
const mongodbUri = process.env.MONGODB_URI?.trim() || (isProd ? '' : localDefaultUri);

if (!mongodbUri) {
  console.error(
    '[config] MONGODB_URI is required in production. Set your Atlas connection string in backend/.env'
  );
  process.exit(1);
}

if (isProd && mongodbUri.includes('127.0.0.1')) {
  console.warn('[config] Warning: production is using a local MongoDB URI');
}

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('change-this')) {
  if (isProd) {
    console.error('[config] JWT_SECRET must be set to a strong secret in production');
    process.exit(1);
  }
  console.warn('[config] Warning: JWT_SECRET is not set or uses the example value');
}

export const env = {
  nodeEnv,
  port: Number(process.env.PORT) || 5000,
  isProd,
  mongodbUri,
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-only-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    cookieName: process.env.JWT_COOKIE_NAME || 'gdi_token',
  },
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:3000')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
};
