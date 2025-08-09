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
        avatar: user.avatar.secure_url,
        name: user.name
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

        let parsed;
        try {
            parsed = JSON.parse(outputData);
        } catch (e) {
            return res.status(500).json({ result: 'Error parsing face match output', error: outputData });
        }
        if (!parsed.results || !Array.isArray(parsed.results) || parsed.results.length === 0) {
            return res.json({ results: [] });
        }

        // For each matched face, process attendance
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const results = [];
        for (const result of parsed.results) {
            if (!result.success || !result.userId) {
                results.push({ success: false });
                continue;
            }
            const userId = result.userId;
            let attendance = await Attendance.findOne({
                userId: userId,
                createdAt: { $gte: todayStart, $lt: todayEnd }
            });
            let user = users.find(u => u._id.toString() === userId);
            let name = user ? user.name : 'User';
            let statusMsg = '';
            let success = true;
            try {
                if (action === 'checkin') {
                    if (attendance && attendance.checkIn) {
                        statusMsg = 'Already checked in today';
                    } else if (!attendance) {
                        attendance = new Attendance({
                            userId,
                            checkIn: new Date(),
                            checkInStatus: 'Present'
                        });
                        await attendance.save();
                        statusMsg = 'Check-in successful';
                    } else {
                        attendance.checkIn = new Date();
                        attendance.checkInStatus = 'Present';
                        await attendance.save();
                        statusMsg = 'Check-in successful';
                    }
                } else if (action === 'checkout') {
                    if (!attendance || !attendance.checkIn) {
                        statusMsg = 'Check-in required before check-out';
                        success = false;
                    } else if (attendance.checkOut) {
                        statusMsg = 'Already checked out today';
                    } else {
                        attendance.checkOut = new Date();
                        attendance.checkOutStatus = 'Present';
                        await attendance.save();
                        statusMsg = 'Check-out successful';
                    }
                }
            } catch (error) {
                statusMsg = 'Failed to update attendance';
                success = false;
            }
            results.push({
                userId,
                name,
                success,
                status: statusMsg
            });
        }
        return res.json({ results });
    });
};