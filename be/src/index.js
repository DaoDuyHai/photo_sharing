import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tự động load file .env nằm trong thư mục be
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import cors from "cors";
import dbConnect from "./configs/dbConnect.js";
import UserRouter from "./routes/UserRouter.js";
import PhotoRouter from "./routes/PhotoRouter.js";
import AuthRouter from "./routes/AuthRouter.js";
import verifyToken from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 8081;

// Đảm bảo thư mục lưu trữ ảnh tồn tại
const uploadDir = path.resolve(__dirname, "../images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Kết nối Cơ sở dữ liệu MongoDB
dbConnect();

// Middlewares
app.use(cors());
app.use(express.json());

// Phục vụ static files cho hình ảnh upload
app.use("/images", express.static(uploadDir));

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "Photo Sharing API is running smoothly",
    timestamp: new Date().toISOString(),
  });
});

// Authentication Routes (Public)
app.use("/api/auth", AuthRouter);

// Token Verification Middleware cho các tài nguyên bảo vệ
app.use(verifyToken);

// Protected Routes
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);

// Error handling middleware chung
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Đã xảy ra lỗi nội bộ trên server" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
