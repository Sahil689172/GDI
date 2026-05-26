import { Router } from 'express';
import authRoutes from './authRoutes.js';
import workspaceRoutes from './workspaceRoutes.js';
import taskRoutes from './taskRoutes.js';
import goalRoutes from './goalRoutes.js';
import focusRoutes from './focusRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import { getDbHealth } from '../config/db.js';

const router = Router();

router.get('/health', (_req, res) => {
  const database = getDbHealth();
  const ok = database.status === 'ok';
  res.status(ok ? 200 : 503).json({
    success: ok,
    message: ok ? 'Gotta-do-it API is running' : 'API up but database disconnected',
    timestamp: new Date().toISOString(),
    database,
  });
});

router.use('/auth', authRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/tasks', taskRoutes);
router.use('/goals', goalRoutes);
router.use('/focus', focusRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);

export default router;
