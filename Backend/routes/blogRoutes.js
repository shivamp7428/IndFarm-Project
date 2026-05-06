import express from "express";
import { createBlog, deleteBlog, getAllBlogs, getBlogsByFarmer } from "../controllers/blogController.js";
import { isFarmer, protect } from './../middlewares/authMiddleware.js';
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.post("/add", protect, isFarmer, upload.single("blogImage"), createBlog);
router.get("/", getAllBlogs);
router.get("/farmer/:id", getBlogsByFarmer);
router.delete("/:id", protect, isFarmer, deleteBlog);
export default router;