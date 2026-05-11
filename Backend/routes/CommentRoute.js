import express from "express";
import auth from './../middlewares/auth.js';
import { createComment, deleteComment, getCommentsByFarmer, getCommentsByProductId } from "../controllers/commentController.js";

const router = express.Router();
router.post("/create",auth,createComment);
router.get("/product/:productId",getCommentsByProductId);
router.get( "/farmer/:farmerId", getCommentsByFarmer);
router.delete("/delete/:commentId",auth,deleteComment);




export default router;