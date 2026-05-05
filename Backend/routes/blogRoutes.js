import express from "express";
const router = express.Router();
import { createBlog, getAllBlogs, getBlogsByFarmer } from "../controllers/blogController.js";
import { isFarmer, protect } from './../middlewares/authMiddleware.js';

router.post("/", protect, isFarmer, createBlog);
router.get("/", getAllBlogs);
router.get("/farmer/:id", getBlogsByFarmer);

export default router;