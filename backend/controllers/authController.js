import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

import OTP from '../models/OTP.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Send OTP to email
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = asyncHandler(async (req, res) => {
    const email = req.body.email?.trim();
    if (!email) {
        res.status(400);
        throw new Error('Email is required');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Generate random 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove existing OTP for this email
    await OTP.deleteMany({ email });

    await OTP.create({
        email,
        otp
    });

    const message = `Your Digital Library registration OTP is: ${otp}\nThis OTP is valid for 5 minutes.`;

    try {
        await sendEmail({
            email,
            subject: 'Registration OTP for Digital Library',
            message,
        });
        res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (error) {
        console.error('Email could not be sent:', error);
        await OTP.deleteMany({ email });
        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, password, otp } = req.body;
    const email = req.body.email?.trim();

    if (!otp) {
        res.status(400);
        throw new Error('OTP is required');
    }

    const validOtpRecord = await OTP.findOne({ email: email.trim() });
    
    if (!validOtpRecord) {
        res.status(400);
        throw new Error('OTP has expired or no OTP requested for this email');
    }

    if (String(validOtpRecord.otp).trim() !== String(otp).trim()) {
        res.status(400);
        throw new Error('Invalid OTP entered');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    if (user) {
        // Clear OTP after successful registration
        await OTP.deleteMany({ email });
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.trim() });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid username or password');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Send OTP for forgot password
// @route   POST /api/auth/forgot-password-otp
// @access  Public
const forgotPasswordOtp = asyncHandler(async (req, res) => {
    const email = req.body.email?.trim();
    if (!email) {
        res.status(400);
        throw new Error('Email is required');
    }

    const user = await User.findOne({ email });
    if (!user) {
        res.status(404);
        throw new Error('User not found with this email');
    }

    // Generate random 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Remove existing OTP for this email
    await OTP.deleteMany({ email });

    await OTP.create({
        email,
        otp
    });

    const message = `Your Digital Library password reset OTP is: ${otp}\nThis OTP is valid for 5 minutes.`;

    try {
        await sendEmail({
            email,
            subject: 'Password Reset OTP for Digital Library',
            message,
        });
        res.status(200).json({ success: true, message: 'OTP sent to email' });
    } catch (error) {
        console.error('Email could not be sent:', error);
        await OTP.deleteMany({ email });
        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const cleanEmail = email?.trim();

    if (!cleanEmail || !otp || !newPassword) {
        res.status(400);
        throw new Error('Email, OTP and new password are required');
    }

    const validOtpRecord = await OTP.findOne({ email: cleanEmail });
    
    if (!validOtpRecord) {
        res.status(400);
        throw new Error('OTP has expired or no OTP requested for this email');
    }

    if (String(validOtpRecord.otp).trim() !== String(otp).trim()) {
        res.status(400);
        throw new Error('Invalid OTP entered');
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Clear OTP after successful password reset
    await OTP.deleteMany({ email: cleanEmail });

    res.status(200).json({ success: true, message: 'Password reset successfully' });
});

export { sendOtp, registerUser, loginUser, getUserProfile, getUsers, forgotPasswordOtp, resetPassword };
