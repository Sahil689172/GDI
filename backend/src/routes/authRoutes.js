import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { signupRules, loginRules } from '../validators/authValidators.js';

const router = Router();

router.post('/signup', signupRules, validate, authController.signup);
router.post('/login', loginRules, validate, authController.login);
router.post('/logout', authController.logout);
router.get('/profile', protect, authController.getProfile);

export default router;
