import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Present', 'Absent','Late'],
        default: 'Absent'
    }
}, {
    timestamps: true
});

// Export the Attendance model
export default mongoose.model('Attendance', attendanceSchema);
