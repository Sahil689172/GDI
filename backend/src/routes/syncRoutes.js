import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as syncController from '../controllers/syncController.js';
import { statusRules, pullRules, pushRules } from '../validators/syncValidators.js';

const router = Router();
router.use(protect);

router.get('/status', statusRules, validate, syncController.status);
router.post('/pull', pullRules, validate, syncController.pull);
router.post('/push', pushRules, validate, syncController.push);

export default router;

