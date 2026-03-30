import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const checkUser = async () => {
    await connectDB();
    try {
        const email = "jane@example.com";
        const password = "password123";

        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found in DB");
        } else {
            console.log(`User found: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`Password Hash: ${user.password}`);
            const match = await user.matchPassword(password);
            console.log(`Password Match: ${match}`);
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUser();
