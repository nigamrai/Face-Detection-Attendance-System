import mongoose from 'mongoose';

// Define the Attendance schema with check-in and check-out functionality
const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    checkIn: {
        type: Date, // Stores check-in time
        default: null
    },
    checkInStatus:{
         type: String,
        enum: ['Present', 'Absent', 'Late','Early'],
        default: 'Absent'
    },
    checkOut: {
        type: Date, // Stores check-out time
        default: null
    },
    checkOutStatus: {
        type: String,
        enum: ['Present', 'Absent', 'Late','Early'],
        default: 'Absent'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Export the Attendance model
export default mongoose.model('Attendance', attendanceSchema);