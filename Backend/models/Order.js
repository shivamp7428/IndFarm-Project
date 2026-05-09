import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({

   customer:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
   },

   farmer:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
   },

   deliveryPartner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Delivery",
      default:null
   },

   products:[
      {
         product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
         },

         quantity:Number,

         price:Number
      }
   ],

   shippingAddress:{
      address:String,
      city:String,
      pincode:String,
      phone:String
   },

   paymentMethod:{
      type:String,
      enum:["cod","online"],
      default:"cod"
   },

   paymentStatus:{
      type:String,
      enum:["pending","paid","failed"],
      default:"pending"
   },

   orderStatus:{
      type:String,
      enum:[
         "placed",
         "accepted",
         "packed",
         "shipped",
         "delivered",
         "cancelled"
      ],
      default:"placed"
   },

   deliveryStatus:{
      type:String,
      enum:[
         "pending",
         "assigned",
         "accepted",
         "picked_up",
         "delivered"
      ],
      default:"pending"
   },

   totalAmount:{
      type:Number,
      required:true
   },

   deliveryCharge:{
      type:Number,
      default:0
   },

   deliveryOTP:{
      type:String
   },

   deliveredAt:Date

},{timestamps:true})

const Order = mongoose.models.Order || mongoose.model("Order",orderSchema);

export default Order;