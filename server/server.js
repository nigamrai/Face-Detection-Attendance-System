import express from 'express';
import connectDB from './config/DBConfig.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/user.model.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to match your frontend's URL and port
    credentials: true
}));
app.use(express.json());

// Mount authentication routes
app.use('/api/v1/auth', authRoutes);

app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});
