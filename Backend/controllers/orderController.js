import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Delivery from "../models/DeliveryPartner.js";


export const createOrder = async (req, res) => {
   try {
      const { farmer, products, shippingAddress, paymentMethod} = req.body;
      if (!products || products.length === 0) {
         return res.status(400).json({
            success: false,
            message: "No products selected"
         });
      }
      let totalProductPrice = 0;
      const formattedProducts = [];
      for (const item of products) {
         const productData =  await Product.findById(item.product);
         if (!productData) {
            return res.status(404).json({
               success: false,
               message: "Product not found"
            });
         }
         const total =  productData.price * item.quantity;
         totalProductPrice += total;
         formattedProducts.push({
            product: productData._id,
            productName: productData.name,
            productImage: productData.images?.[0] || "",
            quantity: item.quantity,
            price: productData.price,
            total
         });
      }
      let deliveryCharge = 0;
      if (totalProductPrice < 100) {
         deliveryCharge = 30;
      }

      else if (totalProductPrice < 300) {
         deliveryCharge = 15;
      }

      const totalAmount = totalProductPrice + deliveryCharge;
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const order = await Order.create({
            customer: req.user.id,
            farmer,
            products: formattedProducts,
            shippingAddress,
            paymentMethod,
            totalProductPrice,
            deliveryCharge,
            totalAmount,
            deliveryOTP: otp
         });

      res.status(201).json({
         success: true,
         message: "Order placed successfully",
         order
      });
   }
   catch (error) {
      console.log(error);
      res.status(500).json({
         success: false,
         message: error.message

      });
   }
};

export const getUserOrders = async (req, res) => {
   try {
      const { userId } = req.params;

      const orders = await Order.find({
         customer: userId
      })
      .populate({
         path: "farmer",
         select: "fullName farmName img phone farmLocation"
      })
      .populate({
         path: "deliveryPartner",
         select: "fullName phone vehicleType vehicleNumber",
         options: { strictPopulate: false }
      })
      .sort({ createdAt: -1 });

      return res.status(200).json({
         success: true,
         orders
      });

   } catch (error) {
      console.log("ORDER FETCH ERROR:", error);

      return res.status(500).json({
         success: false,
         message: error.message
      });
   }
};
// GET SINGLE ORDER
export const getSingleOrder = async (req, res) => {

   try {
      const order =  await Order.findById(req.params.orderId)
            .populate("customer", "name email")
            .populate("farmer", "name email")
            .populate("deliveryPartner");

      if (!order) {
         return res.status(404).json({
            success: false,
            message: "Order not found"
         });
      }
      res.status(200).json({
         success: true,
         order
      });
   }
   catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};
// GET FARMER ORDERS
export const getFarmerOrders = async (req, res) => {

   try {
      const orders =
         await Order.find({
            farmer: req.params.farmerId
         })
            .populate("customer", "name email")
            .populate("deliveryPartner")
            .sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         orders
      });
   }
   catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};
// ACCEPT ORDER
export const acceptOrder = async (req, res) => {

   try {
      const order = await Order.findById(req.params.orderId);
      if (!order) {
         return res.status(404).json({
            success: false,
            message: "Order not found"
         });
      }
      order.orderStatus = "accepted";
      await order.save();
      res.status(200).json({
         success: true,
         message: "Order accepted",
         order
      });
   }
   catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};
// PACK ORDER
export const packOrder = async (req, res) => {
   try {
      const order =  await Order.findById(req.params.orderId);
      order.orderStatus = "packed";
      await order.save();
      res.status(200).json({
         success: true,
         message: "Order packed",
         order
      });
   }
   catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};
// ASSIGN DELIVERY PARTNER
export const assignDeliveryPartner = async (req, res) => {
   try {
      const { deliveryPartnerId } = req.body;
      const order = await Order.findById(req.params.orderId);
      const deliveryPartner = await Delivery.findById(deliveryPartnerId);
      if (!order) {
         return res.status(404).json({
            success: false,
            message: "Order not found"
         });
      }
      if (!deliveryPartner) {
         return res.status(404).json({
            success: false,
            message: "Delivery partner not found"
         });
      }
      order.deliveryPartner = deliveryPartner._id;
      order.deliveryStatus = "assigned";
      order.orderStatus = "shipped";
      await order.save();
      res.status(200).json({
         success: true,
         message: "Delivery partner assigned",
         order
      });
   }
   catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};
// GET DELIVERY ORDERS
export const getDeliveryOrders = async (req, res) => {
   try {
      const orders = await Order.find({
            deliveryPartner: req.params.deliveryId
         })
            .populate("customer", "name")
            .populate("farmer", "name")
            .sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         orders
      });
   }
   catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};
// ACCEPT DELIVERY
export const acceptDelivery = async (req, res) => {
   try {
      const order =  await Order.findById(req.params.orderId);
      order.deliveryStatus = "accepted";
      await order.save();
      res.status(200).json({
         success: true,
         message: "Delivery accepted",
         order
      });
   }
   catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};
// PICKUP ORDER
export const pickupOrder = async (req, res) => {
   try {
      const order =  await Order.findById(req.params.orderId);
      order.deliveryStatus =  "picked_up";
      order.orderStatus =  "out_for_delivery";
      await order.save();
      res.status(200).json({
         success: true,
         message: "Order picked up",
         order
      });
   }
   catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};
// DELIVER ORDER

export const deliverOrder = async (req, res) => {
   try {
      const { otp } = req.body;
      const order = await Order.findById(req.params.orderId);
      if (!order) {
         return res.status(404).json({
            success: false,
            message: "Order not found"
         });
      }
      if (order.deliveryOTP !== otp) {
         return res.status(400).json({
            success: false,
            message: "Invalid OTP"
         });
      }
      order.orderStatus = "delivered";
      order.deliveryStatus = "delivered";
      order.deliveredAt = new Date();
      if (order.paymentMethod === "cod") {
         order.paymentStatus = "paid";
      }
      await order.save();
      res.status(200).json({
         success: true,
         message: "Order delivered successfully",
         order
      });
   }
   catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};
// CANCEL ORDER
export const cancelOrder = async (req, res) => {
   try {
      const order = await Order.findById(req.params.orderId);
      if (!order) {
         return res.status(404).json({
            success: false,
            message: "Order not found"
         });
      }
      if (order.orderStatus === "shipped" || order.orderStatus === "out_for_delivery" || order.orderStatus === "delivered") {
         return res.status(400).json({
            success: false,
            message: "Order cannot be cancelled now"
         });
      }
      order.orderStatus = "cancelled";
      order.cancelledAt = new Date();
      await order.save();
      res.status(200).json({
         success: true,
         message: "Order cancelled",
         order
      });
   }
   catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};
// UPDATE PAYMENT STATUS

export const updatePaymentStatus = async (req, res) => {

   try {
      const { paymentStatus } = req.body;
      const order = await Order.findById(req.params.orderId);
      order.paymentStatus = paymentStatus;
      await order.save();
      res.status(200).json({
         success: true,
         message: "Payment updated",
         order
      });
   }
   catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};
// ORDER STATS

export const getOrderStats = async (req, res) => {

   try {
      const totalOrders  = await Order.countDocuments();
      const deliveredOrders =
         await Order.countDocuments({
            orderStatus: "delivered"
         });
      const pendingOrders =
         await Order.countDocuments({
            orderStatus: "placed"
         });
      const cancelledOrders =
         await Order.countDocuments({
            orderStatus: "cancelled"
         });
      const orders =
         await Order.find({
            orderStatus: "delivered"
         });
      const totalRevenue =
         orders.reduce(
            (acc, item) => acc + item.totalAmount,
            0
         );
      res.status(200).json({
         success: true,
         stats: {
            totalOrders,
            deliveredOrders,
            pendingOrders,
            cancelledOrders,
            totalRevenue
         }
      });
   }
   catch (error) {
      res.status(500).json({
         success: false,
         message: error.message
      });
   }};