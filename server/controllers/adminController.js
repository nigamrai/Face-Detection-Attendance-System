// GET /api/v1/admin/attendances/search-by-date?date=YYYY-MM-DD
export const searchAttendancesByDate = async (req, res) => {
  try {
    if (!req.query.date) {
      return res.status(400).json({ message: 'Date query parameter is required' });
    }
    const start = new Date(req.query.date);
    
    const attendances = await Attendance.find({ checkIn: start }).populate('userId');
    console.log('Search attendances by date:', req.query.date, 'Found:', attendances);
    res.json({ attendances });
  } catch (err) {
    res.status(500).json({ message: 'Failed to search attendances by date', error: err });
  }
};
// GET /api/v1/admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err });
  }
};
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import { sendUserCredentials } from '../utils/nodemailer.js';
import { v2 as cloudinary } from 'cloudinary';

// GET /api/v1/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err });
  }
};

// POST /api/v1/admin/users
export const addUser = async (req, res) => {
  try {
    let avatarData = null;
    if (req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'avatars',
        width: 150,
        crop: 'scale',
      });
      avatarData = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    }
    const userData = {
      ...req.body,
      avatar: avatarData || {
        public_id: 'default_avatar',
        secure_url: 'https://res.cloudinary.com/dacafjeag/image/upload/v1710000000/default_avatar.png',
      },
    };
    const user = new User(userData);
    await user.save();
    // Send email with credentials
    if (user.email && req.body.password) {
      try {
        await sendUserCredentials(user.email, user.email, req.body.password);
      } catch (mailErr) {
        // Optionally log or handle email error, but don't block user creation
      }
    }
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ message: 'Failed to add user from server', error: err });
  }
};

// PUT /api/v1/admin/users/:id
export const editUser = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      // Upload new avatar to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'avatars',
        width: 150,
        crop: 'scale',
      });
      updateData.avatar = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ user });
  } catch (err) {
    res.status(400).json({ message: 'Failed to update user', error: err });
  }
};

// DELETE /api/v1/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete user', error: err });
  }
};


// GET /api/v1/admin/attendances
 export const getAllAttendances = async (req, res) => {
     try {
   
    const attendances = await Attendance.find().populate('userId');
    res.json({ attendances });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch attendances', error: err });
  }
 }
