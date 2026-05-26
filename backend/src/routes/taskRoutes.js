import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as taskController from '../controllers/taskController.js';
import {
  listTasksRules,
  createTaskRules,
  updateTaskRules,
  taskIdParam,
  reorderTasksRules,
} from '../validators/taskValidators.js';

const router = Router();

router.use(protect);

router.get('/', listTasksRules, validate, taskController.listTasks);
router.put('/reorder', reorderTasksRules, validate, taskController.reorderTasks);
router.post('/', createTaskRules, validate, taskController.createTask);
router.put('/:id', updateTaskRules, validate, taskController.updateTask);
router.delete('/:id', taskIdParam, validate, taskController.deleteTask);

export default router;
