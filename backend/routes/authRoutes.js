import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getUserProfile, getUsers } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/').get(protect, getUsers);

export default router;
