import express from "express";
import {addProduct, deleteProduct, getAllProducts, getMyProducts, updateProduct } from "../controllers/productController.js";
import { isFarmer, protect } from './../middlewares/authMiddleware.js';
import { upload } from "../config/cloudinary.js";

const router = express.Router();
router.get("/", getAllProducts); 
router.post("/add", protect, isFarmer, upload.single("productImage"),addProduct);
router.get("/my-products/:id", protect, isFarmer, getMyProducts);
router.delete("/:id", protect, isFarmer, deleteProduct);
router.put("/:id", protect, isFarmer, upload.single("productImage"), updateProduct);
export default router;