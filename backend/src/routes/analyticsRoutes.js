import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import * as analyticsController from '../controllers/analyticsController.js';

const router = Router();
router.use(protect);

router.get('/', analyticsController.getAnalytics);

export default router;
