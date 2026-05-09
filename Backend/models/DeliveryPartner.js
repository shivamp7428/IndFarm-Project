import mongoose from 'mongoose'

const deliveryPartnerSchema = new mongoose.Schema({

   userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
      unique:true
   },

   phone:{
      type:String,
      required:true,
      trim:true
   },

   phoneVerified:{
      type:Boolean,
      default:false
   },

   aadhaarNumber:{
      type:String,
      required:true,
      trim:true
   },

   aadhaarImage:{
      type:String,
      required:true
   },

   isActive:{
      type:Boolean,
      default:true
   },

   isAvailable:{
      type:Boolean,
      default:false
   },

   vehicleType:{
      type:String,
      required:true,
      enum:["bike","scooter","cycle","car"]
   },

   vehicleNumber:{
      type:String,
      required:true,
      uppercase:true,
      trim:true
   },

   accountHolderName:{
      type:String,
      required:true,
      trim:true
   },

   accountNumber:{
      type:String,
      required:true,
      trim:true
   },

   ifscCode:{
      type:String,
      required:true,
      uppercase:true,
      trim:true
   },

   bankImage:{
      type:String,
      required:true
   },

   status:{
      type:String,
      enum:["pending","approved","rejected"],
      default:"pending"
   }

},{timestamps:true})

const Delivery = mongoose.models.Delivery || mongoose.model("Delivery", deliveryPartnerSchema)

export default Delivery