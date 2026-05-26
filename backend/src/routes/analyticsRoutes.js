import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as analyticsController from '../controllers/analyticsController.js';

const router = Router();
router.use(protect);

router.get('/daily', analyticsController.getDaily);
router.get('/weekly', analyticsController.getWeekly);
router.get('/monthly', analyticsController.getMonthly);
router.get('/heatmap', analyticsController.getHeatmap);

// Backwards-compatible (existing frontend hook)
router.get('/', analyticsController.getAnalytics);

export default router;
