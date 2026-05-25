import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(protect);

router.get('/profile', asyncHandler(async (req, res) => {
  sendSuccess(res, {
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        role: req.user.role,
      },
    },
  });
}));

export default router;
