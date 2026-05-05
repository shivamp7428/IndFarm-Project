import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

// --- LOGIN LOGIC ---
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

    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secret_key', 
      { expiresIn: '7d' }
    );

   return res.status(200).json({
      success: true,
      token,
      user: { id: user._id, fullName: user.fullName, role: user.role }
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
      return res.status(404).json({ success: false, message: "User nahi mila" });
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