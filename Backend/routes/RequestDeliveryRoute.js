import express from "express";
import auth from "../middlewares/auth.js";
import {getDeliveryPartnerRequests,acceptDeliveryRequest,rejectDeliveryRequest, sendDeliveryRequest, getFarmerDeliveryRequests} from "../controllers/RequestDeliveryController.js"

const router = express.Router();
router.post("/create",auth,sendDeliveryRequest);
router.get("/order/:orderId",auth,getFarmerDeliveryRequests);
router.get("/partner/:deliveryPartnerId",auth,getDeliveryPartnerRequests);
router.put("/accept/:requestId",auth,acceptDeliveryRequest);
router.put("/reject/:requestId",auth,rejectDeliveryRequest);

export default router;