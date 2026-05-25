import { createApp } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { env } from './config/env.js';

const start = async () => {
  try {
    await connectDB();
    const app = createApp();

    const server = app.listen(env.port, () => {
      console.log(`[server] ${env.nodeEnv} mode → http://localhost:${env.port}`);
      console.log(`[server] API base → http://localhost:${env.port}/api`);
    });

    const shutdown = async (signal) => {
      console.log(`\n[server] ${signal} received, shutting down...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    console.error('[server] Failed to start:', err.message);
    process.exit(1);
  }
};

start();
