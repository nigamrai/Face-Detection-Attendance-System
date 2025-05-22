import express from 'express';
import connectDB from './config/DBConfig.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';
import attendanceRouter from './routes/attendaceRoutes.js';
import upload from './middlewares/multer.middleware.js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import User from './models/User.js';

// Polyfill for __dirname in ES modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
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
app.use("/api/v1/attendance",attendanceRouter);
// app.post('/api/v1/attendance', upload.single('face'), async (req, res) => {
//     let tempFilePath = '';
    
//     try {
//         if (!req.file) {
//             console.log('No file uploaded');
//             return res.status(400).json({ status: 'error', error: 'No face image provided' });
//         }

//         console.log('File uploaded:', req.file);
//         const uploadedFilePath = path.join(__dirname, req.file.path);
        
//         // Create a temporary file for the Python script to read
//         tempFilePath = path.join(__dirname, 'uploads', `temp_${Date.now()}.jpg`);
//         await fs.promises.copyFile(uploadedFilePath, tempFilePath);
        
//         // Execute Python script with the file path as an argument
//         const py = spawn('python', [
//             path.join(__dirname, 'face_match_simple.py'),
//             tempFilePath  // Pass the file path as an argument
//         ]);
  
//         let result = Buffer.alloc(0);
//         let errorOutput = '';
        
//         // Set a timeout for the Python script
//         const timeout = 30000; // 30 seconds
//         const timeoutId = setTimeout(() => {
//             py.kill('SIGTERM');
//             errorOutput += 'Python script timed out';
//         }, timeout);
        
//         // Handle stdout
//         py.stdout.on('data', (data) => {
//             result = Buffer.concat([result, data]);
//         });
  
//         // Handle stderr
//         py.stderr.on('data', (data) => {
//             const errorMsg = data.toString();
//             console.error('Python error:', errorMsg);
//             errorOutput += errorMsg;
//         });
  
//         // Handle process close
//         py.on('close', (code) => {
//             clearTimeout(timeoutId);
            
//             // Clean up files
//             const cleanup = async () => {
//                 try {
//                     await Promise.all([
//                         fs.promises.unlink(uploadedFilePath).catch(console.error),
//                         tempFilePath && fs.promises.unlink(tempFilePath).catch(console.error)
//                     ]);
//                 } catch (e) {
//                     console.error('Error cleaning up files:', e);
//                 }
//             };

//             cleanup().finally(() => {
//                 if (code !== 0) {
//                     console.error(`Python process exited with code ${code}`);
//                     return res.status(500).json({ 
//                         status: 'error', 
//                         error: 'Face processing failed',
//                         details: errorOutput || 'No error details available'
//                     });
//                 }

//                 try {
//                     const json = result.length > 0 ? 
//                         JSON.parse(result.toString()) : 
//                         { status: 'error', error: 'No result from face processing' };
                    
//                     res.json(json);
//                 } catch (e) {
//                     console.error('Error parsing Python output:', e);
//                     res.status(500).json({ 
//                         status: 'error', 
//                         error: 'Invalid response from face processor',
//                         details: result.toString()
//                     });
//                 }
//             });
//         });
  
//         // Handle process error
//         py.on('error', (error) => {
//             clearTimeout(timeoutId);
//             console.error('Failed to start Python script:', error);
//             res.status(500).json({ 
//                 status: 'error', 
//                 error: 'Failed to process image',
//                 details: error.message
//             });
//         });
        
//     } catch (error) {
//         console.error('Error processing upload:', error);
//         // Clean up any created files
//         try {
//             if (tempFilePath) {
//                 await fs.promises.unlink(tempFilePath).catch(console.error);
//             }
//         } catch (e) {
//             console.error('Error during cleanup:', e);
//         }
        
//         res.status(500).json({ 
//             status: 'error', 
//             error: 'Failed to process image',
//             details: error.message
//         });
//     }
// });
app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});
