import express from 'express';
import {  login, updateProfile, changePassword, deleteAccount, signup, getProfile, sendOTP, verifyOTP } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';
import { upload } from '../config/cloudinary.js';

const UserRouter = express.Router();

UserRouter.post('/signup', upload.single('farmImage'), signup);
UserRouter.post('/login', login);
UserRouter.post('/send-otp', sendOTP);
UserRouter.post('/verify-otp', verifyOTP);

UserRouter.get('/me',auth, getProfile);
UserRouter.put('/update',auth, upload.single('farmImage'), updateProfile);
UserRouter.put('/change-password',auth, changePassword);
UserRouter.delete('/delete',auth, deleteAccount);

export default UserRouter;