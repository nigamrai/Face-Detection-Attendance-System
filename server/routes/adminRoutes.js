import express from 'express';
  
import {getAllUsers,
  addUser,
  editUser,
  deleteUser,
  getAllAttendances,
  getUserById,
  searchAttendancesByDate
} from '../controllers/adminController.js';
import upload from '../middlewares/multer.middleware.js';

const router = express.Router();

// User routes
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/user/create', upload.single('avatar'), addUser);
router.put('/users/:id', upload.single('avatar'), editUser);
router.delete('/users/:id', deleteUser);

// Attendance routes
router.get('/attendances', getAllAttendances);
router.get('/attendances/search-by-date', searchAttendancesByDate);


export default router;
