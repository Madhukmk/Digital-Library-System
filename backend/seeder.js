import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { mockBooks, mockUsers } from './data/mockData.js';
import User from './models/User.js';
import Book from './models/Book.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Book.deleteMany();

        // Use create or save to trigger pre-save hook for password hashing
        for (const user of mockUsers) {
            await User.create(user);
        }

        await Book.insertMany(mockBooks);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Book.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
