import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },

  identifier: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,      
    lowercase: true 
  },

  password: { 
    type: String, 
    required: function() {
      return !this.googleId; 
    }
  },

  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  },

  role: { 
    type: String, 
    enum: ['farmer', 'customer'], 
    required: true 
  },

  deliveryAddress: { type: String, default: "" },
  pincode: { type: String, default: "" },

  farmName: { type: String, default: "" },
  farmLocation: { type: String, default: "" },
  farmingType: { type: String, default: "" },
  products: [{ type: String, default: [] }],
  farmImageUrl: { type: String, default: "" },

  img: { type: String, default: "" },

  isVerified: { type: Boolean, default: false },
  otp: { type: String, default: null }, 
  otpExpiry: { type: Date, default: null },

  about: {
    type: String,
    default: "",
    maxLength: 500,
  },

  stars: {
    type: Number,
    default: 4.5,
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const User = mongoose.model('User', userSchema);
export default User;