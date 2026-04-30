import express, { json } from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"
import connectDB from './config/db.js';

dotenv.config()
connectDB();
const app = express()
app.use(express.json())
app.use(cors({origin: "http://localhost:3000",credentials: true}));
app.use(cors());
app.use(morgan("combined"))


const port = process.env.PORT  || 5000
app.listen(port , ()=>{
    console.log("port run on" , port)
})

