import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS   
  }
});

export const signup = async (req, res) => {
  try {
    const { fullName, identifier, password, role, farmName, farmLocation, farmingType, products, deliveryAddress, pincode } = req.body;
    const existingUser = await User.findOne({ identifier });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email/phone" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let farmImageUrl = "";
    if (req.file) {
      farmImageUrl = req.file.path; 
    }

    const newUser = new User({ fullName, identifier, password: hashedPassword, role, farmName, farmLocation, farmingType, products: products ? JSON.parse(products) : [],  deliveryAddress,  pincode,farmImageUrl });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

   return res.status(201).json({
      message: "User registered successfully!",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        role: newUser.role,
        farmImageUrl: newUser.farmImageUrl 
      }
    });

  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    if(!identifier || !password) {
        return res.status(400).json({ message: "Identifier and password required" });
    }

    const user = await User.findOne({ identifier });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // --- OTP LOGIC STARTS HERE ---
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    console.log("Sending mail to:", user.identifier);
    try {
        await transporter.sendMail({
            to: user.identifier, 
            subject: "Login Verification OTP",
            text: `Your OTP Code: ${otp}. It will expire in 5 minutes.`
        });
    } catch (mailError) {
        console.log("MAIL ERROR DETAILS:", mailError);
        return res.status(500).json({ message: "Error sending OTP email" });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
      otpRequired: true 
    });

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

//Get profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

//  UPDATE PROFILE ---
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;

    delete updates.password; 
    delete updates.role;

    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { $set: updates }, 
      { new: true, runValidators: true }
    ).select("-password");

   return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
   return res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// CHANGE PASSWORD ---
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    return res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error changing password" });
  }
};

//  DELETE ACCOUNT ---
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    return res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Delete failed" });
  }
};

// OTP Send logic
export const sendOTP = async (req, res) => {
  try {
    const { identifier } = req.body; 

    const user = await User.findOne({ identifier });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      to: identifier, 
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP logic
export const verifyOTP = async (req, res) => {
  try {
    const { identifier, otp } = req.body;

    const user = await User.findOne({ identifier });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Expiry check
    if (!user.otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP expired or not requested" });
    }

    // 2. Match check
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // 3. Success! OTP clear
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secret_key', 
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, fullName: user.fullName, role: user.role }
    });

  } catch (error) {
    return res.status(500).json({ message: "Verification failed" });
  }
};