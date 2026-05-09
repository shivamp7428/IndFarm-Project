import express from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from './config/db.js';
import UserRouter from './routes/authRoutes.js';
import dns from 'dns';
import productRoutes from "./routes/productRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
<<<<<<< HEAD
import passport from 'passport';
import './config/passport.js';
=======
import CommentRoute from './routes/CommentRoute.js'
import DeliveryRoute from './routes/DeliveryRoute.js';
>>>>>>> 72ebd1e (Added Comment and Delivery Section)

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();
connectDB();

const app = express();

app.use(passport.initialize());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(morgan("dev")); 
app.use("/api/auth", UserRouter);
app.use("/api/products", productRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/comment",CommentRoute);
app.use("/api/delivery",DeliveryRoute);


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});