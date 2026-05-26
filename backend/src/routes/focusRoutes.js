import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as focusController from '../controllers/focusController.js';
import { createSessionRules } from '../validators/focusValidators.js';

const router = Router();
router.use(protect);

router.get('/sessions', focusController.listSessions);
router.get('/stats', focusController.getStats);
router.post('/sessions', createSessionRules, validate, focusController.createSession);

export default router;
