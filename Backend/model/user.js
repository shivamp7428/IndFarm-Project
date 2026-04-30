import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["farmer", "consumer"],
    required: true,
  },

  address: {
    fullAddress: String,
    city: String,
    state: String,
    pincode: String,
  },

  location: {
    lat: Number,
    lng: Number,
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);