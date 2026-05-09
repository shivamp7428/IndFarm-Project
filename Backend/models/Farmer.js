import mongoose from "mongoose"

const farmerSchema = new mongoose.Schema({
   userId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
      unique:true
   },

   aadhaarNumber:{
      type:String,
      required:true
   },

   aadhaarImage:{
      type:String,
      required:true
   },

   accountHolderName:{
      type:String,
      required:true
   },

   accountNumber:{
      type:String,
      required:true
   },

   ifscCode:{
      type:String,
      required:true
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

const farmer = mongoose.models.Farmer || mongoose.model("Farmer" , farmerSchema);
export default farmer;