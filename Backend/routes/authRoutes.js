import express from 'express';
import {  login, updateProfile, changePassword, deleteAccount, signup, getProfile, sendOTP, verifyOTP, getFarmerById } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';
import { upload } from '../config/cloudinary.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const UserRouter = express.Router();

UserRouter.post('/signup', upload.single('farmImage'), signup);
UserRouter.post('/login', login);
UserRouter.post('/send-otp', sendOTP);
UserRouter.post('/verify-otp', verifyOTP);

UserRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

UserRouter.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {

    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.redirect(`http://localhost:3000/login-success?token=${token}`);
  }
);

UserRouter.get('/me',auth, getProfile);
UserRouter.put('/update',auth,upload.fields([{ name: "farmImage", maxCount: 1 },{ name: "profileImage", maxCount: 1 }]),updateProfile);
UserRouter.put('/change-password',auth, changePassword);
UserRouter.delete('/delete',auth, deleteAccount);
UserRouter.get("/:id", getFarmerById);
export default UserRouter;