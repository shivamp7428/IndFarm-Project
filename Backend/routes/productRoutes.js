import express from "express";
import {addProduct, getAllProducts, getMyProducts } from "../controllers/productController.js";

import { isFarmer, protect } from './../middlewares/authMiddleware.js';

const router = express.Router();
router.get("/", getAllProducts); 
router.post("/add", protect, isFarmer, addProduct);
router.get("/my-products/:id", protect, isFarmer, getMyProducts);

export default router;