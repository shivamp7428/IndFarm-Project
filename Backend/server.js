import express from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from './config/db.js';
import UserRouter from './routes/authRoutes.js';
import dns from 'dns';
import productRoutes from "./routes/productRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import passport from 'passport';
import './config/passport.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoute.js'
import DeliveryRoute from './routes/DeliveryRoute.js'
import CommentRoute from './routes/CommentRoute.js'
import RequestDeliveryRoute from './routes/RequestDeliveryRoute.js'

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();
connectDB();

const app = express();

app.use(passport.initialize());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  "http://localhost:3000",
  "https://ind-farm-project-j1qb.vercel.app",
  "https://skjiigroup.com",
  "https://www.skjiigroup.com"
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(morgan("dev")); 
app.use("/api/auth", UserRouter);
app.use("/api/products", productRoutes);
app.use("/api/comment",CommentRoute)
app.use("/api/delivery-request",RequestDeliveryRoute)
app.use("/api/delivery",DeliveryRoute)
app.use("/api/blogs", blogRoutes);
app.use("/api/orders", orderRoutes);
app.use('/api/payment', paymentRoutes);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});