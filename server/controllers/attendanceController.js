import { spawn } from 'child_process';
import path from 'path';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';

// Get attendance records for a specific user
export const getAttendanceByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const records = await Attendance.find({ userId }).sort({ createdAt: -1 });
        // Format response for frontend (SN, date time, status)
        const formatted = records.map((rec, idx) => ({
            sn: idx + 1,
            dateTime: rec.createdAt,
            status: rec.status
        }));
        res.json({ success: true, records: formatted });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch attendance', error: err });
    }
};

export const recognizeFace = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const imagePath = path.join(process.cwd(), 'uploads', req.file.filename);
    console.log('Face Recognition Started');
    console.log(`Processing image: ${imagePath}`);
    const users = await User.find();
    console.log(users)
    // Prepare user data with IDs and avatar URLs
    const userData = users.map(user => ({
        _id: user._id.toString(),
        avatar: user.avatar.secure_url
    }));
    console.log('User data:', userData);
    
    // Convert user data to JSON string
    const userDataString = JSON.stringify(userData);
    const pythonProcess = spawn('python3', ['face_match.py', imagePath, userDataString]);

    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
        console.log("data from python code",data);
        const text = data.toString();
        outputData += text;
        console.log('Python Output:', text);
    });

    pythonProcess.stderr.on('data', (data) => {
        const text = data.toString();
        errorData += text;
        console.error('Python Error:', text);
    });

    pythonProcess.on('close', (code) => {
        console.log('Python Process Exited with code:', code);
        
        if (code !== 0) {
            console.error('Final Python Error:', errorData);
            return res.status(500).json({ 
                result: 'Error processing image', 
                error: errorData 
            });
        }

        console.log('Final Python Output:', outputData);
        const userId = outputData.trim();
        console.log('Matched Userid:', userId);
        if (userId) {
            (async () => {
                try {
                    // Create attendance record
                    const existingAttendance = await Attendance.findOne({
    userId: userId,
    createdAt: {
    $gte: new Date(new Date().setHours(0, 0, 0, 0)),
    $lt: new Date(new Date().setHours(23, 59, 59, 999))
} // Using timestamps to check for today's attendance
});

if (existingAttendance) {
    return res.status(200).json({
        success: true,
        result: 'Attendance already marked for today',
        error: 'Duplicate attendance'
    });
}

// Proceed to create attendance if not already done
const attendance = new Attendance({
                        userId,
                        status: 'Present'
                    });
                    await attendance.save();
                    
                    res.json({ 
                        success:true,
                        result: outputData.trim(),
                        attendance: 'Record created successfully'
                    });
                } catch (error) {
                    console.error('Error creating attendance record:', error);
                    res.status(500).json({ 
                        success: false,
                        result: outputData.trim(),
                        error: 'Failed to create attendance record'
                    });
                }
            })();
        } else {
            res.json({ 
                result: outputData.trim(),
                attendance: 'No match found'
            });
        }
    });
};
