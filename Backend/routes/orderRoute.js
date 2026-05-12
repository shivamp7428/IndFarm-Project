
import express from "express";
import auth from "../middlewares/auth.js";
import { acceptDelivery, acceptOrder, assignDeliveryPartner, cancelOrder, createOrder, deliverOrder, getDeliveryOrders, getFarmerOrders, getOrderStats, getSingleOrder, getUserOrders, markOutForDelivery, packOrder, pickupOrder, updatePaymentStatus } from './../controllers/orderController.js';

const router = express.Router();

router.post("/create", auth, createOrder);
router.get("/user/:userId", auth, getUserOrders);
router.get("/:orderId", auth, getSingleOrder);
router.get("/farmer/:farmerId", auth, getFarmerOrders);
router.put("/accept/:orderId", auth, acceptOrder);
router.put("/pack/:orderId", auth, packOrder);
router.put("/assign-delivery/:orderId",auth,assignDeliveryPartner);
router.get("/delivery/:deliveryId",auth,getDeliveryOrders);
router.put("/delivery/accept/:orderId",auth,acceptDelivery);
router.put("/pickup/:orderId",auth,pickupOrder);
router.put("/deliver/:orderId",auth,deliverOrder);
router.put("/cancel/:orderId",auth,cancelOrder);
router.put( "/payment/:orderId", auth, updatePaymentStatus);
router.get( "/stats/all", auth, getOrderStats);
router.put("/out-for-delivery/:orderId", auth, markOutForDelivery);

export default router;