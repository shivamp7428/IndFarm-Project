import express from "express"; 
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from './config/db.js';
import UserRouter from './routes/authRoutes.js';
import dns from 'dns';

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

connectDB();

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(morgan("dev")); 
app.use("/api/auth", UserRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});