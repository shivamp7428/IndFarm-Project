import DeliveryRequest from "../models/RequestDelivery.js";
import Delivery from "../models/DeliveryPartner.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

export const sendDeliveryRequest = async (req, res) => {
   try {

      const { orderId, deliveryPartnerId, deliveryDate, deliveryTime, note } = req.body;

      if (!orderId || !deliveryPartnerId || !deliveryDate || !deliveryTime) {
         return res.status(400).json({
            success: false,
            message: "orderId, deliveryPartnerId, deliveryDate, deliveryTime are required"
         });
      }

      const order = await Order.findById(orderId);

      if (!order) {
         return res.status(404).json({
            success: false,
            message: "Order not found"
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
            message: "Customer cannot be assigned as delivery partner for this order"
         });
      }

      if (order.farmer.toString() !== req.user.id) {
         return res.status(403).json({
            success: false,
            message: "You are not allowed to send request for this order"
         });
      }

      const existingRequest = await DeliveryRequest.findOne({
         orderId,
         deliveryPartnerId,
         status: "pending"
      });

      if (existingRequest) {
         return res.status(400).json({
            success: false,
            message: "Request already exists for this partner & order"
         });
      }

      const request = await DeliveryRequest.create({
         orderId,
         farmerId: req.user.id,
         deliveryPartnerId,
         deliveryDate,
         deliveryTime,
         note: note || "",
         status: "pending"
      });

      res.status(201).json({
         success: true,
         message: "Delivery request sent successfully",
         request
      });

   } catch (error) {

      console.log("SEND DELIVERY REQUEST ERROR:", error);

      res.status(500).json({
         success: false,
         message: error.message || "Internal server error"
      });

   }
};

export const getFarmerDeliveryRequests = async (req, res) => {

   try {

      const requests = await DeliveryRequest.find({
         farmerId: req.user.id
      })
      .populate("orderId")
      .populate({
         path: "deliveryPartnerId",
         populate: {
            path: "userId",
            select: "fullName email img"
         }
      })
      .sort({ createdAt: -1 });

      res.status(200).json({
         success: true,
         requests
      });

   } catch (error) {

      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};

export const getDeliveryPartnerRequests = async (req, res) => {
  try {
    const { deliveryPartnerId } = req.params;

    if (!deliveryPartnerId) {
      return res.status(400).json({
        success: false,
        message: "deliveryPartnerId is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(deliveryPartnerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid deliveryPartnerId"
      });
    }

    const requests = await DeliveryRequest.find({
      deliveryPartnerId
    })
      .populate({
        path: "farmerId",
        select: "fullName phone farmName img"
      })
      .populate({
        path: "orderId",
        select: "status totalPrice items createdAt"
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requests
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const acceptDeliveryRequest = async (req, res) => {
  try {
    const request = await DeliveryRequest.findOneAndUpdate(
      { _id: req.params.requestId, status: "pending" },
      { status: "accepted" },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found or already processed"
      });
    }

    const order = await Order.findById(request.orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    await Order.findByIdAndUpdate(request.orderId, {
      deliveryPartner: request.deliveryPartnerId,
      orderStatus: "packed",
      deliveryStatus: "assigned"
    });

    await DeliveryRequest.updateMany(
      {
        orderId: request.orderId,
        _id: { $ne: request._id },
        status: "pending"
      },
      { status: "rejected" }
    );

    res.status(200).json({
      success: true,
      message: "Delivery request accepted & order assigned"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const rejectDeliveryRequest = async (req, res) => {

   try {

      const request = await DeliveryRequest.findById(req.params.requestId);

      if (!request) {
         return res.status(404).json({
            success: false,
            message: "Request not found"
         });
      }

      request.status = "rejected";

      await request.save();

      res.status(200).json({
         success: true,
         message: "Delivery request rejected"
      });

   } catch (error) {

      res.status(500).json({
         success: false,
         message: error.message
      });
   }
};

