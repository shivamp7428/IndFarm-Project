import User from "../model/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const {name,email,phone,password,role,address,location} = req.body;

    // validation
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    // check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = await User.create({name, email, phone, password: hashedPassword, role, address, location});
    res.status(201).json({message: "Signup successful",user: {  id: user._id,  name: user.name,  role: user.role} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};