import Delivery from "../models/DeliveryPartner.js";
import Order from "../models/Order.js";


// REGISTER DELIVERY PARTNER

export const createDeliveryPartner = async (req, res) => {

   try {

      const {phone, aadhaarNumber,  vehicleType,  vehicleNumber,  accountHolderName,  accountNumber,  ifscCode} = req.body;

      if ( !req.files?.aadhaarImage || !req.files?.bankImage) {
         return res.status(400).json({  success: false,  message: "All images are required"});
      }

      const aadhaarImage =
      req.files.aadhaarImage[0].path;

      const bankImage =
      req.files.bankImage[0].path;

      const existing =
      await Delivery.findOne({
         userId: req.user.id
      });

      if (existing) {
         return res.status(400).json({ success: false, message: "Delivery partner already exists"});
      }
      if ( !phone || !aadhaarNumber || !vehicleType || !vehicleNumber || !accountHolderName || !accountNumber || !ifscCode) {
       return res.status(400).json({success: false, message:"Please fill all fields"});
   }
      const deliveryPartner = await Delivery.create({userId: req.user.id,phone,phoneVerified: true,aadhaarNumber, aadhaarImage, vehicleType, vehicleNumber, accountHolderName,accountNumber,ifscCode,bankImage,status: "pending",isActive: true, isAvailable: false});
      res.status(201).json({success: true,message:"Delivery partner request submitted successfully", deliveryPartner});

   } catch (error) {
      console.log(error);
      res.status(500).json({success: false,message: error.message});
   }
};

// GET DELIVERY STATUS
export const getDeliveryPartnerStatus = async(req,res)=>{
   try{

      const deliveryPartner =
      await Delivery.findOne({
         userId:req.params.userId
      });

      if(!deliveryPartner){
         return res.status(404).json({
            success:false,
            message:"Delivery partner not found"
         })
      }

      res.status(200).json({
         success:true,
         deliveryPartner
      })

   }catch(error){

      res.status(500).json({
         success:false,
         message:error.message
      })

   }
}
// TOGGLE ONLINE / OFFLINE

export const toggleAvailability = async(req,res)=>{
   try{

      const deliveryPartner =
      await Delivery.findById(req.params.id);

      if(!deliveryPartner){
         return res.status(404).json({
            success:false,
            message:"Delivery partner not found"
         })
      }

      deliveryPartner.isAvailable =
      !deliveryPartner.isAvailable;

      await deliveryPartner.save();

      res.status(200).json({
         success:true,
         message:"Availability updated",
         isAvailable:deliveryPartner.isAvailable
      })

   }catch(error){

      res.status(500).json({
         success:false,
         message:error.message
      })

   }
}
// LEAVE DELIVERY PARTNER

export const leaveDeliveryPartner = async(req,res)=>{
   try{

      const deliveryPartner =
      await Delivery.findById(req.params.id);

      if(!deliveryPartner){
         return res.status(404).json({
            success:false,
            message:"Delivery partner not found"
         })
      }

      deliveryPartner.isActive = false;
      deliveryPartner.isAvailable = false;

      await deliveryPartner.save();

      res.status(200).json({
         success:true,
         message:"Delivery partner removed successfully"
      })

   }catch(error){

      res.status(500).json({
         success:false,
         message:error.message
      })

   }
}
// GET ASSIGNED ORDERS

export const getAssignedOrders = async(req,res)=>{
   try{

      const orders = await Order.find({
         deliveryPartner:req.params.deliveryId
      })
      .populate("customer")
      .populate("farmer");

      res.status(200).json({
         success:true,
         orders
      })

   }catch(error){

      res.status(500).json({
         success:false,
         message:error.message
      })

   }
}
// ACCEPT DELIVERY ORDER

export const acceptDeliveryOrder = async(req,res)=>{
   try{

      const order =
      await Order.findById(req.params.orderId);

      if(!order){
         return res.status(404).json({
            success:false,
            message:"Order not found"
         })
      }

      order.deliveryStatus = "accepted";

      await order.save();

      res.status(200).json({
         success:true,
         message:"Order accepted successfully"
      })

   }catch(error){

      res.status(500).json({
         success:false,
         message:error.message
      })

   }
}
// REJECT DELIVERY ORDER

export const rejectDeliveryOrder = async(req,res)=>{
   try{

      const order =
      await Order.findById(req.params.orderId);

      if(!order){
         return res.status(404).json({
            success:false,
            message:"Order not found"
         })
      }

      order.deliveryPartner = null;
      order.deliveryStatus = "pending";

      await order.save();

      res.status(200).json({
         success:true,
         message:"Order rejected successfully"
      })

   }catch(error){

      res.status(500).json({
         success:false,
         message:error.message
      })

   }
}
// PICKUP ORDER

export const pickupOrder = async(req,res)=>{
   try{

      const order = await Order.findById(req.params.orderId);
      if(!order){
         return res.status(404).json({
            success:false,
            message:"Order not found"
         })
      }
      order.deliveryStatus = "picked_up";

      await order.save();

      res.status(200).json({
         success:true,
         message:"Order picked up successfully"
      })

   }catch(error){
      res.status(500).json({
         success:false,
         message:error.message
      })

   }
}
// DELIVER ORDER

export const deliverOrder = async(req,res)=>{
   try{

      const order =
      await Order.findById(req.params.orderId);

      if(!order){
         return res.status(404).json({
            success:false,
            message:"Order not found"
         })
      }

      order.deliveryStatus = "delivered";

      await order.save();

      res.status(200).json({
         success:true,
         message:"Order delivered successfully"
      })

   }catch(error){

      res.status(500).json({
         success:false,
         message:error.message
      })

   }
}
// UPDATE CURRENT LOCATION

export const updateDeliveryLocation = async(req,res)=>{
   try{

      const {lat,lng} = req.body;

      const deliveryPartner =
      await Delivery.findById(req.params.deliveryId);

      if(!deliveryPartner){
         return res.status(404).json({
            success:false,
            message:"Delivery partner not found"
         })
      }

      deliveryPartner.currentLocation = {
         lat,
         lng
      }

      await deliveryPartner.save();

      res.status(200).json({
         success:true,
         message:"Location updated"
      })

   }catch(error){

      res.status(500).json({
         success:false,
         message:error.message
      })

   }
}
// DELIVERY DASHBOARD

export const getDeliveryDashboard = async(req,res)=>{
   try{

      const totalOrders =
      await Order.countDocuments({
         deliveryPartner:req.params.deliveryId
      });

      const completedOrders =
      await Order.countDocuments({
         deliveryPartner:req.params.deliveryId,
         deliveryStatus:"delivered"
      });

      const pendingOrders =
      await Order.countDocuments({
         deliveryPartner:req.params.deliveryId,
         deliveryStatus:{
            $ne:"delivered"
         }
      });

      res.status(200).json({
         success:true,
         totalOrders,
         completedOrders,
         pendingOrders
      })

   }catch(error){

      res.status(500).json({
         success:false,
         message:error.message
      })

   }
}

export const getDeliveryEarnings = async(req,res)=>{
   try{

      const orders = await Order.find({
         deliveryPartner:req.params.deliveryId,
         deliveryStatus:"delivered"
      });

      let totalEarnings = 0;

      orders.forEach((order)=>{
         totalEarnings += order.deliveryCharge || 0;
      });

      res.status(200).json({
         success:true,
         totalOrders:orders.length,
         totalEarnings,
         orders
      })

   }catch(error){

      res.status(500).json({
         success:false,
         message:error.message
      })

   }
}


export const getCompletedDeliveries = async(req,res)=>{
   try{

      const orders = await Order.find({
         deliveryPartner:req.params.deliveryId,
         deliveryStatus:"delivered"
      })

      .populate("customer","name phone")
      .populate("farmer","name phone");

      res.status(200).json({
         success:true,
         total:orders.length,
         orders
      })

   }catch(error){

      res.status(500).json({
         success:false,
         message:error.message
      })

   }
}