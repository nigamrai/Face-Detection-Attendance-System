import express from 'express'
import upload from '../middlewares/multer.middleware.js';
import { recognizeFace, getAttendanceByUser } from '../controllers/attendanceController.js';

const attendanceRouter=express.Router();
attendanceRouter.post('/',upload.single("image"),recognizeFace);
attendanceRouter.get('/:userId', getAttendanceByUser);
export default attendanceRouter;
