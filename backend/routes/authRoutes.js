import express from 'express';
const router = express.Router();
import { sendOtp, registerUser, loginUser, getUserProfile, getUsers, forgotPasswordOtp, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/send-otp', sendOtp);
router.post('/forgot-password-otp', forgotPasswordOtp);
router.post('/reset-password', resetPassword);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/').get(protect, getUsers);

export default router;
