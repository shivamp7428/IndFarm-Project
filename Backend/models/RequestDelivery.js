import mongoose from "mongoose";

const deliveryRequestSchema = new mongoose.Schema({
   orderId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Order",
      required:true
   },

   farmerId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
   },

   deliveryPartnerId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Delivery",
      required:true
   },

   deliveryDate:{
      type:String,
      required:true
   },

   deliveryTime:{
      type:String,
      required:true
   },

   note:{
      type:String
   },
   status:{
      type:String,
      enum:["pending","accepted","rejected"],
      default:"pending"
   }

},{timestamps:true});

const DeliveryRequest = mongoose.models.DeliveryRequest || mongoose.model("DeliveryRequest", deliveryRequestSchema);
export default DeliveryRequest;