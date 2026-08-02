import express from 'express';
import {  login, updateProfile, changePassword, deleteAccount, signup, getProfile, sendOTP, verifyOTP, getFarmerById, getAllFarmers, createFarmer } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';
import { upload } from '../config/cloudinary.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const UserRouter = express.Router();

UserRouter.post('/signup', upload.single('farmImage'), signup);

UserRouter.post('/login', login);

UserRouter.post('/send-otp', sendOTP);

UserRouter.post('/verify-otp', verifyOTP);


// Google
UserRouter.get('/google', passport.authenticate('google', { 
  scope: ['profile','email'] 
}));

UserRouter.get('/google/callback',
passport.authenticate('google',{
 failureRedirect:'/login',
 session:false
}),
(req,res)=>{
 const token = jwt.sign(
   {id:req.user._id},
   process.env.JWT_SECRET,
   {expiresIn:'7d'}
 );

 res.redirect(
 `${process.env.APP_URL}/login-success?token=${token}`
 );
});


// Protected
UserRouter.get('/me', auth, getProfile);

UserRouter.put(
'/update',
auth,
upload.fields([
 {name:"farmImage",maxCount:1},
 {name:"profileImage",maxCount:1}
]),
updateProfile);


UserRouter.put('/change-password',auth,changePassword);

UserRouter.delete('/delete',auth,deleteAccount);


// Normal routes last
UserRouter.get('/farmers',getAllFarmers);

UserRouter.get('/:id',getFarmerById);

UserRouter.post('/create-farmer',createFarmer);
export default UserRouter;