import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Delivery from "../models/DeliveryPartner.js";
import User from "../models/User.js";
import DeliveryRequest from '../models/RequestDelivery.js'

export const createOrder = async (req, res) => {
   try {

      const { farmer, products, shippingAddress, paymentMethod } = req.body;

      if (!products || products.length === 0) {
         return res.status(400).json({
            success: false,
            message: "No products selected"
         });
      }

      let totalProductPrice = 0;
      const formattedProducts = [];

      for (const item of products) {

         const productData = await Product.findById(item.product);

         if (!productData) {
            return res.status(404).json({
               success: false,
               message: "Product not found"
            });
         }

         if (productData.stock < item.quantity) {
            return res.status(400).json({
               success: false,
               message: `${productData.name} is out of stock`
            });
         }

         const total = productData.price * item.quantity;
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
      const latitude = shippingAddress?.latitude || null;
      const longitude = shippingAddress?.longitude || null;

      const order = await Order.create({
         customer: req.user.id,
         farmer,
         products: formattedProducts,

         shippingAddress: {
            ...shippingAddress,
            latitude,
            longitude
         },

         paymentMethod,

         totalProductPrice,
         deliveryCharge,
         totalAmount,
         deliveryOTP: otp,
         orderStatus: "placed",
         deliveryStatus: "pending",
         deliveryPartner: null
      });

      for (const item of products) {
         await Product.findByIdAndUpdate(
            item.product,
            {
               $inc: { stock: -item.quantity }
            }
         );
      }

      res.status(201).json({
         success: true,
         message: "Order placed successfully",
         order
      });

   } catch (error) {

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

      let orders = await Order.find({
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
      .sort({ updatedAt: -1 });

      orders = orders.sort((a, b) => {

         if (a.orderStatus === "cancelled" && b.orderStatus !== "cancelled") {
            return 1;
         }

         if (a.orderStatus !== "cancelled" && b.orderStatus === "cancelled") {
            return -1;
         }

         return new Date(b.updatedAt) - new Date(a.updatedAt);

      });

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

      let orders = await Order.find({
         farmer: req.params.farmerId
      })
      .populate("customer", "name email")
      .populate("deliveryPartner")
      .sort({ updatedAt: -1 });

      orders = orders.sort((a, b) => {
         if (a.orderStatus === "cancelled" && b.orderStatus !== "cancelled") {
            return 1;
         }

         if (a.orderStatus !== "cancelled" && b.orderStatus === "cancelled") {
            return -1;
         }

         return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

      res.status(200).json({
         success: true,
         orders
      });

   } catch (error) {

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

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (deliveryPartnerId === "SELF") {

      const farmer = await User.findById(req.user.id);
      if (!farmer) {
        return res.status(404).json({
          success: false,
          message: "Farmer not found"
        });
      }

      order.deliveryPartner = farmer._id; 
      order.deliveryStatus = "assigned";
      order.orderStatus = "packed";

      await order.save();
      return res.status(200).json({
        success: true,
        message: "Self delivery assigned successfully",
        order
      });
    }

    const deliveryPartner = await Delivery.findById(deliveryPartnerId);

    if (!deliveryPartner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found"
      });
    }

    if (order.customer.toString() === deliveryPartner.userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Customer cannot be delivery partner"
      });
    }

    order.deliveryPartner = deliveryPartner._id;
    order.deliveryStatus = "assigned";
    order.orderStatus = "shipped";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Delivery partner assigned successfully",
      order
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getDeliveryOrders = async (req, res) => {
  try {
    const { deliveryPartnerId } = req.params;

    const orders = await Order.find({
      deliveryPartner: deliveryPartnerId
    })
    .populate("customer", "fullName profileImage phone") 
    .populate("farmer", "fullName farmName address latitude longitude")
    .sort({ createdAt: -1 }); 

    return res.status(200).json({
      success: true,
      orders 
    });

  } catch (error) {
    return res.status(500).json({
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
      order.orderStatus =  "shipped";
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
   
 export const markOutForDelivery = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // optional safety check
    if (order.orderStatus !== "shipped") {
      return res.status(400).json({
        success: false,
        message: "Order must be shipped first"
      });
    }

    order.orderStatus = "out_for_delivery";
    order.deliveryStatus = "picked_up";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order is now out for delivery",
      order
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};