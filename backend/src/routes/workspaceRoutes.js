import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import * as workspaceController from '../controllers/workspaceController.js';
import {
  createWorkspaceRules,
  updateWorkspaceRules,
  workspaceIdParam,
  reorderWorkspacesRules,
} from '../validators/workspaceValidators.js';

const router = Router();

router.use(protect);

router.get('/', workspaceController.listWorkspaces);
router.put('/reorder', reorderWorkspacesRules, validate, workspaceController.reorderWorkspaces);
router.post('/', createWorkspaceRules, validate, workspaceController.createWorkspace);
router.put('/:id', updateWorkspaceRules, validate, workspaceController.updateWorkspace);
router.delete('/:id', workspaceIdParam, validate, workspaceController.deleteWorkspace);

export default router;
