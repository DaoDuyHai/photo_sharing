# 📸 Photo Sharing Platform

> **Fullstack Web Application (MERN Stack)**  
> **Tác giả:** Đào Duy Hải  
> **Phiên bản:** 1.0.0

---

## 📌 Giới thiệu tổng quan

**Photo Sharing Platform** là ứng dụng web chia sẻ hình ảnh và tương tác cộng đồng theo kiến trúc Single Page Application (SPA). Hệ thống cho phép người dùng đăng ký tài khoản, đăng nhập an toàn, chia sẻ các bức ảnh cá nhân, để lại bình luận và theo dõi các tương tác của cộng đồng thành viên.

Dự án được xây dựng với mục tiêu thể hiện năng lực hiểu và phát triển **End-to-End** từ Client (React, Material-UI, State Management) đến Server (Node.js, Express, MongoDB Aggregation, Multipart Streaming, JWT Auth).

---

## 🚀 Công nghệ sử dụng (Tech Stack)

### Backend
* **Runtime**: Node.js (ES Modules)
* **Framework**: Express.js
* **Database & ODM**: MongoDB Atlas, Mongoose
* **Xác thực & Bảo mật**: JSON Web Token (JWT), Bcrypt (Password Hashing)
* **Xử lý tệp tin**: Multer (Multipart/form-data upload & validation)
* **Tiện ích**: Dotenv, Cors

### Frontend
* **Core**: React.js 18 (Hooks, Functional Components)
* **Routing**: React Router DOM v6 (Protected Routes, Dynamic Routing)
* **UI Framework**: Material-UI (MUI v5), Emotion
* **Giao tiếp API**: Modern Fetch API with centralized JWT bearer interceptor

---

## ✨ Tính năng chính (Features)

1. **Xác thực & Quản lý phiên (Authentication & Authorization)**:
   * Đăng ký tài khoản mới với các thông tin cá nhân (họ tên, vị trí, nghề nghiệp, tiểu sử). Mật khẩu được băm 10 vòng bằng `bcrypt`.
   * Đăng nhập an toàn, cấp phát JSON Web Token (JWT) có thời hạn 24 giờ.
   * Custom Auth Middleware tại server tự động bảo vệ tất cả endpoint nhạy cảm; Client tự động điều hướng (Route Protection) khi chưa xác thực.
2. **Quản lý & Chia sẻ hình ảnh (Photo Sharing & Upload)**:
   * Đăng tải ảnh với bộ lọc định dạng ảnh nghiêm ngặt (chỉ chấp nhận `image/*`) và giới hạn kích thước tối đa 10MB.
   * Chuẩn hóa tên tệp (`UPLOADS_<timestamp>_<clean_name>`) tránh trùng lặp tài nguyên.
   * Xem dòng thời gian ảnh của từng người dùng, sắp xếp theo thời gian mới nhất.
3. **Bình luận tương tác (Nested Comments)**:
   * Bình luận trực tiếp vào từng bức ảnh theo mô hình Embedded Documents.
   * Hiển thị danh sách bình luận kèm định danh người bình luận và nhãn thời gian thực.
4. **Thống kê & Theo dõi hoạt động (User Activity Tracking)**:
   * Danh sách thành viên hiển thị trực quan số lượng ảnh đã đăng (Badge xanh) và số lượng bình luận đã đóng góp (Badge đỏ).
   * Trang xem lại toàn bộ lịch sử bình luận của một người dùng trên mọi bức ảnh trong hệ thống.

---

## 💡 Điểm nổi bật về mặt Kỹ thuật (Technical Highlights)

* **Tối ưu hóa Truy vấn Cơ sở dữ liệu (Database Optimization)**:
  * Thay vì kéo toàn bộ dữ liệu ảnh vào bộ nhớ Node.js (gây rủi ro Out-Of-Memory) và lặp truy vấn N+1 (`countDocuments`), chức năng thống kê thành viên (`getAllUser`) và lịch sử bình luận (`getUserComments`) được tái cấu trúc hoàn toàn bằng **MongoDB Aggregation Pipeline** (`$group`, `$unwind`, `$match`, `$project`, `$sort`).
  * Giảm tải I/O và thời gian phản hồi API từ $O(N \times M)$ xuống độ phức tạp tuyến tính $O(N)$ với bộ nhớ tối thiểu.
* **Xử lý Static Media an toàn**:
  * Cấu hình thư mục lưu trữ tĩnh độc lập, kiểm tra và tự động khởi tạo thư mục lưu trữ khi server khởi động.
  * Lọc MIME-type cấp Multer ngăn chặn upload mã độc / script giả dạng ảnh.
* **Cấu trúc Source Code phân tầng (Clean Architecture)**:
  * Tách biệt rõ ràng: Routing -> Middleware -> Controller -> Model -> Database Config.
  * Quản lý biến môi trường tập trung qua `.env`, hỗ trợ mở rộng môi trường dễ dàng.

---

## 📁 Cấu trúc thư mục (Directory Structure)

```text
Photo-sharing/
├── be/                         # Backend RESTful API
│   ├── images/                 # Thư mục lưu trữ media tĩnh (ignored on git)
│   ├── src/
│   │   ├── configs/            # Kết nối Database (MongoDB Atlas)
│   │   ├── controllers/        # Xử lý logic nghiệp vụ (Auth, User, Photo)
│   │   ├── middleware/         # JWT Verification Middleware
│   │   ├── models/             # Mongoose Schemas (User, Photo)
│   │   ├── routes/             # Định tuyến API
│   │   └── index.js            # Entry point của Server
│   ├── .env.example            # Mẫu cấu hình môi trường Backend
│   └── package.json
│
├── fe/                         # Frontend React Application
│   ├── public/                 # Static assets & index.html
│   ├── src/
│   │   ├── components/         # Các React Components (Login, Register, TopBar, ...)
│   │   ├── lib/                # API client utility (fetchModelData)
│   │   ├── config.js           # Cấu hình Base URL và Helpers
│   │   ├── App.js              # Routing và Main Layout
│   │   └── index.js            # Entry point của React
│   ├── .env.example            # Mẫu cấu hình môi trường Frontend
│   └── package.json
│
├── .gitignore                  # Git ignore root (Bảo vệ .env và tệp tạm)
└── README.md                   # Tài liệu dự án
```

---

## 🛠️ Hướng dẫn cài đặt & Chạy Local (Local Setup)

### Yêu cầu tiên quyết
* Node.js >= 16.x
* Quản lý gói: `npm` hoặc `yarn`
* Tài khoản MongoDB Atlas hoặc MongoDB Server Local

---

### Bước 1: Thiết lập Backend

1. Di chuyển vào thư mục `be`:
   ```bash
   cd be
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Tạo file cấu hình môi trường `.env`:
   ```bash
   cp .env.example .env
   ```
   *Điền thông tin kết nối MongoDB và mã bí mật JWT vào `.env`:*
   ```env
   PORT=3001
   MONGO_URI=your_mongodb_connection_string
   SECRET_KEY=your_jwt_secret_key
   ```
4. Khởi chạy Backend server:
   ```bash
   # Chạy môi trường phát triển (tự reload với nodemon):
   npm run dev

   # Hoặc chạy môi trường tiêu chuẩn:
   npm start
   ```
   *Backend sẽ lắng nghe tại: `http://localhost:3001`*

---

### Bước 2: Thiết lập Frontend

1. Mở một terminal mới và di chuyển vào thư mục `fe`:
   ```bash
   cd fe
   ```
2. Cài đặt các thư viện:
   ```bash
   npm install
   ```
3. Tạo file cấu hình môi trường `.env`:
   ```bash
   cp .env.example .env
   ```
   *Nội dung `.env`:*
   ```env
   REACT_APP_API_URL=http://localhost:3001
   ```
4. Khởi chạy ứng dụng React:
   ```bash
   npm start
   ```
   *Trình duyệt sẽ tự động mở giao diện tại: `http://localhost:3000`*

---

## 📡 Danh sách API Endpoints (API Documentation)

### 1. Authentication (`/api/auth`)
| Phương thức | Endpoint | Yêu cầu Auth | Mô tả |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/user` | ❌ | Đăng ký tài khoản mới |
| `POST` | `/api/auth/login` | ❌ | Đăng nhập hệ thống & nhận JWT |

### 2. User Management (`/api/user`)
| Phương thức | Endpoint | Yêu cầu Auth | Mô tả |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/user/list` | ✅ | Lấy danh sách thành viên kèm thống kê ảnh & comment |
| `GET` | `/api/user/:id` | ✅ | Lấy thông tin chi tiết một người dùng |
| `GET` | `/api/user/commentsOfUser/:id` | ✅ | Lấy danh sách bình luận của người dùng trên toàn hệ thống |

### 3. Photo & Comments (`/api/photo`)
| Phương thức | Endpoint | Yêu cầu Auth | Mô tả |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/photo/photosOfUser/:id` | ✅ | Lấy danh sách ảnh của một người dùng |
| `POST` | `/api/photo/new` | ✅ | Upload hình ảnh mới (`multipart/form-data`) |
| `POST` | `/api/photo/commentsOfPhoto/:photo_id` | ✅ | Gửi bình luận mới vào ảnh |

---

## 👨‍💻 Thông tin tác giả
* **Họ và tên:** Đào Duy Hải
* **Vai trò:** Fullstack Developer / Backend Developer Intern
* **Dự án:** Photo Sharing Platform (End-to-End MERN Application)

