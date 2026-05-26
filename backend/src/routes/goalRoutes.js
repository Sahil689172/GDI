import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as goalController from '../controllers/goalController.js';
import {
  createGoalRules,
  updateGoalRules,
  goalIdParam,
  listGoalsRules,
} from '../validators/goalValidators.js';

const router = Router();
router.use(protect);

router.get('/analytics/summary', goalController.getGoalAnalytics);
router.get('/', listGoalsRules, validate, goalController.listGoals);
router.post('/', createGoalRules, validate, goalController.createGoal);
router.put('/:id', updateGoalRules, validate, goalController.updateGoal);
router.delete('/:id', goalIdParam, validate, goalController.deleteGoal);
router.post('/:id/log-day', goalIdParam, validate, goalController.logGoalDay);

export default router;
