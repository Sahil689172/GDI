import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as notificationController from '../controllers/notificationController.js';
import {
  listRules,
  createRules,
  idParam,
} from '../validators/notificationValidators.js';

const router = Router();
router.use(protect);

router.get('/', listRules, validate, notificationController.list);
router.post('/generate', notificationController.generate);
router.post('/', createRules, validate, notificationController.create);
router.put('/read-all', notificationController.markAllRead);
router.put('/:id/read', idParam, validate, notificationController.markRead);
router.delete('/:id', idParam, validate, notificationController.remove);

export default router;
