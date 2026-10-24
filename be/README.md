# 🚀 Photo Sharing API (Backend)

Backend RESTful API cho ứng dụng Photo Sharing Platform, xây dựng bằng Node.js, Express và MongoDB Atlas.

## 🛠️ Tech Stack
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB Atlas qua Mongoose ODM
- **Authentication**: JWT (JSON Web Token), Bcrypt
- **Media Upload**: Multer

## 📋 Hướng dẫn cài đặt
1. Cài đặt packages:
   ```bash
   npm install
   ```
2. Cấu hình biến môi trường:
   Sao chép `.env.example` thành `.env` và điền cấu hình:
   ```env
   PORT=3001
   MONGO_URI=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret_key
   ```
3. Khởi chạy:
   ```bash
   npm run dev  # Môi trường development với nodemon
   npm start    # Môi trường production
   ```
