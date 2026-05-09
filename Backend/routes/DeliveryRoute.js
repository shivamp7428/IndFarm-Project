import express from 'express';
import { acceptDeliveryOrder, createDeliveryPartner, deliverOrder, getAssignedOrders, getCompletedDeliveries, getDeliveryDashboard, getDeliveryEarnings, getDeliveryPartnerStatus, leaveDeliveryPartner, pickupOrder, rejectDeliveryOrder, toggleAvailability, updateDeliveryLocation } from './../controllers/deliveryController.js';
import { upload } from "../config/cloudinary.js";
import auth from './../middlewares/auth.js';

const router = express.Router();

router.post("/register", auth,upload.fields([{name:"aadhaarImage",maxCount:1},{name:"bankImage",maxCount:1}]), createDeliveryPartner)

router.get("/status/:userId", getDeliveryPartnerStatus)

router.put("/availability/:id", toggleAvailability)

router.put("/leave/:id", leaveDeliveryPartner)

router.get("/orders/:deliveryId", getAssignedOrders)

router.put("/accept/:orderId", acceptDeliveryOrder)

router.put("/reject/:orderId", rejectDeliveryOrder)

router.put("/pickup/:orderId", pickupOrder)

router.put("/deliver/:orderId", deliverOrder)

router.put("/location/:deliveryId", updateDeliveryLocation)

router.get("/earnings/:deliveryId", getDeliveryEarnings)

router.get("/history/:deliveryId", getCompletedDeliveries)

router.get("/dashboard/:deliveryId", getDeliveryDashboard)

export default router;
