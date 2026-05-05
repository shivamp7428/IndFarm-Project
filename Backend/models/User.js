import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
  },
  identifier: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,      
    lowercase: true 
},
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['farmer', 'customer'], 
    required: true 
  },
  deliveryAddress: { 
    type: String,
  },
  pincode: { 
    type: String 
  },

  farmName: { 
    type: String 
  },
  farmLocation: { 
    type: String 
  },
  farmingType: { 
    type: String 
  },
  products: [{ 
    type: String 
  }],
  farmImageUrl: { 
    type: String 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const User = mongoose.model('User', userSchema);
export default User;