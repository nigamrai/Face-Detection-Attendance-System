import { spawn } from 'child_process';
import path from 'path';
import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

// Get attendance records for a specific user
export const getAttendanceByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const records = await Attendance.find({ userId }).sort({ createdAt: -1 });
        // Format response for frontend (SN, date, checkIn, checkOut, status)
        const formatted = records.map((rec, idx) => ({
            sn: idx + 1,
            date: rec.createdAt,
            checkIn: rec.checkIn,
            checkOut: rec.checkOut,
            status: rec.status
        }));
        res.json({ success: true, records: formatted });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch attendance', error: err });
    }
};

// Recognize face and handle check-in/check-out
export const recognizeFace = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { action } = req.body; // 'checkin' or 'checkout'
    if (!action || !['checkin', 'checkout'].includes(action)) {
        return res.status(400).json({ message: 'Invalid or missing action (checkin/checkout)' });
    }

    const imagePath = path.join(process.cwd(), 'uploads', req.file.filename);
    const users = await User.find();
    const userData = users.map(user => ({
        _id: user._id.toString(),
        avatar: user.avatar.secure_url
    }));
    const userDataString = JSON.stringify(userData);
    const pythonProcess = spawn('python3', ['face_match.py', imagePath, userDataString]);

    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
        outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
    });

    pythonProcess.on('close', async (code) => {
        if (code !== 0) {
            return res.status(500).json({ 
                result: 'Error processing image', 
                error: errorData 
            });
        }

        const userId = outputData.trim();
        if (!userId) {
            return res.json({ 
                result: outputData.trim(),
                attendance: 'No match found'
            });
        }

        try {
            // Find today's attendance record for this user
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);

            let attendance = await Attendance.findOne({
                userId: userId,
                createdAt: { $gte: todayStart, $lt: todayEnd }
            });

            if (action === 'checkin') {
                if (attendance && attendance.checkIn) {
                    return res.status(200).json({
                        success: true,
                        result: 'Already checked in today',
                        attendance: attendance
                    });
                }
                if (!attendance) {
                    attendance = new Attendance({
                        userId,
                        checkIn: new Date(),
                        status: 'Present'
                    });
                } else {
                    attendance.checkIn = new Date();
                    attendance.status = 'Present';
                }
                await attendance.save();
                return res.json({ 
                    success: true,
                    result: 'Check-in successful',
                    attendance
                });
            } else if (action === 'checkout') {
                if (!attendance || !attendance.checkIn) {
                    return res.status(400).json({
                        success: false,
                        result: 'Check-in required before check-out'
                    });
                }
                if (attendance.checkOut) {
                    return res.status(200).json({
                        success: true,
                        result: 'Already checked out today',
                        attendance
                    });
                }
                attendance.checkOut = new Date();
                await attendance.save();
                return res.json({ 
                    success: true,
                    result: 'Check-out successful',
                    attendance
                });
            }
        } catch (error) {
            return res.status(500).json({ 
                success: false,
                result: 'Failed to update attendance',
                error: error.message
            });
        }
    });
};