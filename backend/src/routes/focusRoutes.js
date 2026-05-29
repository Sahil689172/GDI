import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as focusController from '../controllers/focusController.js';
import { startSessionRules, endSessionRules } from '../validators/focusValidators.js';

const router = Router();
router.use(protect);

// Requested contract
router.get('/', focusController.listSessions);
router.post('/start', startSessionRules, validate, focusController.start);
router.post('/end', endSessionRules, validate, focusController.end);
router.get('/stats', focusController.getStats);

export default router;
