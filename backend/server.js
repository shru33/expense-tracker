import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { connectDb } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import dns from 'node:dns';

dns.setServers(['8.8.8.8']);

dotenv.config();
const app = express();
const __dirname = path.resolve();

//Middleware to handle coors
app.use(
    cors({
        origin: process.env.CLIENT_URL || '*',
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
)

app.use(express.json());
const PORT = process.env.PORT || 5000;

connectDb();
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

//Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})
/* app.get("/", (req, res) => {
    res.send("API is running...");
}); */