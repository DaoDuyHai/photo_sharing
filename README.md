# 📸 HỆ THỐNG CHIA SẺ HÌNH ẢNH & TƯƠNG TÁC
## (PHOTO SHARING & INTERACTION PLATFORM)

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.x-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Security](https://img.shields.io/badge/Auth-JWT_Bcrypt-FF6F00?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MUI](https://img.shields.io/badge/UI-Material--UI_v5-007FFF?logo=mui&logoColor=white)](https://mui.com/)

> **Fullstack End-to-End Web Application (MERN Stack)**  
> Xây dựng với **Node.js, Express, MongoDB (Mongoose), JWT Auth và React.js**.  
> Tác giả: **Đào Duy Hải** ([@DaoDuyHai](https://github.com/DaoDuyHai))  
> Vai trò ứng tuyển: **Backend Developer Intern**  

---

## 📑 MỤC LỤC
1. [Kiến Trúc Tổng Quan](#1-kiến-trúc-tổng-quan)
2. [Đặc Điểm Kỹ Thuật Nổi Bật](#2-đặc-điểm-kỹ-thuật-nổi-bật)
3. [Mô Hình Dữ Liệu & Thiết Kế Lược Đồ (Database Schema)](#3-mô-hình-dữ-liệu--thiết-kế-lược-đồ-database-schema)
4. [Luồng Xác Thực & Vòng Đời Phiên Đăng Nhập (Auth Lifecycle)](#4-luồng-xác-thực--vòng-đời-phiên-đăng-nhập-auth-lifecycle)
5. [Cấu Trúc Thư Mục Dự Án](#5-cấu-trúc-thư-mục-dự-án)
6. [Danh Sách REST API Endpoints (8 Endpoints)](#6-danh-sách-rest-api-endpoints-8-endpoints)
7. [Hướng Dẫn Cài Đặt & Chạy Thử Nhanh](#7-hướng-dẫn-cài-đặt--chạy-thử-nhanh)
8. [Lộ Trình Mở Rộng (Future Roadmap)](#8-lộ-trình-mở-rộng-future-roadmap)
9. [Thông Tin Tác Giả](#9-thông-tin-tác-giả)

---

## 1. KIẾN TRÚC TỔNG QUAN

> **Ghi chú về định vị dự án:** Dự án được phát triển theo mô hình Client - Server hoàn chỉnh nhằm thể hiện năng lực hiểu biết **End-to-End**: cách Backend thiết kế API phục vụ Client, luân chuyển Token xác thực, xử lý tải lên tệp tin nhị phân (Multipart/Form-Data) và tối ưu hóa truy vấn Database.

```text
  ┌────────────────────────────────────────────────────────────────────────┐
  │                           REACT.JS CLIENT (SPA)                        │
  │  - Giao diện Material-UI (TopBar, UserList, UserPhotos, UserDetail)    │
  │  - Quản lý phiên đăng nhập qua LocalStorage & Bearer Token Interceptor │
  │  - Định tuyến phân quyền bằng React Router DOM v6                      │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                    HTTP REST Requests│ Multipart/Form-Data
                    Bearer JWT Auth   │ JSON Payloads
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                      NODE.JS & EXPRESS.JS BACKEND                      │
  │  - Public Endpoints: /api/auth (Login, Register với Bcrypt 10 rounds)  │
  │  - JWT Verification Middleware (Bảo vệ tài nguyên cá nhân)             │
  │  - Multer Storage Engine: Lưu trữ & kiểm tra tệp tin ảnh hợp lệ        │
  │  - MongoDB Aggregation Pipeline: Tối ưu thống kê và lịch sử tương tác  │
  └───────────────────────┬────────────────────────┬───────────────────────┘
                          │                        │
                          ▼                        ▼
           ┌────────────────────────────┐    ┌───────────────────────────┐
           │      MONGODB ATLAS DB      │    │    STATIC MEDIA STORAGE   │
           │  - Users Collection        │    │    (be/images/)           │
           │  - Photos Collection       │    │  - Phục vụ Static File    │
           │    (Embedded Comments)     │    │  - Sanitize tên file ảnh  │
           └────────────────────────────┘    └───────────────────────────┘
```

### Công nghệ sử dụng
| Thành phần | Công nghệ / Thư viện | Vai trò kỹ thuật |
| :--- | :--- | :--- |
| **Runtime Backend** | Node.js (ES Modules) | Môi trường thực thi phi đồng bộ |
| **Framework Backend**| Express.js 4.x | Xây dựng RESTful API và Middleware Pipeline |
| **Database & ODM** | MongoDB Atlas & Mongoose 8.x | Lưu trữ tài liệu BSON, Aggregation Pipeline |
| **Xác thực (Auth)** | JWT & Bcrypt | Cấp phát token phi trạng thái (24h), băm mật khẩu 10 salt rounds |
| **Xử lý tệp tin** | Multer | Tiếp nhận multipart upload, lọc MIME-type ảnh, giới hạn 10MB |
| **Frontend Client** | React 18 & Material-UI v5 | Giao diện Single Page Application minh họa luồng end-to-end |
| **Định tuyến Client**| React Router DOM v6 | Quản lý route công khai và route cần xác thực (Protected Routes) |

---

## 2. ĐẶC ĐIỂM KỸ THUẬT NỔI BẬT

1. **Tối ưu hóa truy vấn với MongoDB Aggregation Pipeline:**
   - Thay vì nạp toàn bộ danh sách ảnh thô vào bộ nhớ Node.js rồi lọc thủ công trên RAM và gặp lỗi $N+1$ query khi đếm số lượng, chức năng lấy danh sách thành viên (`getAllUser`) sử dụng các pipeline `$group` và `$unwind` chạy trực tiếp trên Database Engine để đếm số ảnh và số bình luận, sau đó ánh xạ bằng `Map`.
   - Chức năng tra cứu lịch sử bình luận (`getUserComments`) sử dụng pipeline `$unwind`, `$match`, `$project`, `$sort` để trích xuất chính xác dữ liệu từ mảng lồng nhau, tránh nạp dư thừa tài nguyên.

2. **Xác thực an toàn với JSON Web Token (JWT) & Bcrypt:**
   - Mật khẩu người dùng được băm một chiều với Bcrypt qua 10 vòng lặp (salt rounds) trước khi lưu trữ.
   - Middleware `verifyToken` trích xuất `Authorization: Bearer <token>`, giải mã định danh `request.user` để kiểm soát quyền tạo bình luận và đăng tải hình ảnh.

3. **Tiếp nhận & kiểm tra tệp tin tải lên (Multer Media Upload):**
   - Cấu hình kiểm tra định dạng ở tầng Multer: chỉ chấp nhận file ảnh hợp lệ thông qua `mimetype.startsWith("image/")` và giới hạn dung lượng tối đa 10MB mỗi file.
   - Chuẩn hóa tên file (`UPLOADS_<timestamp>_<sanitized_name>`) nhằm loại bỏ ký tự lạ và ngăn ngừa xung đột trùng lặp tên trên hệ thống lưu trữ.

4. **Kiến trúc End-to-End đồng bộ:**
   - Client React tự động đính kèm Token vào HTTP Header cho mọi request bảo mật.
   - Khi có tương tác upload ảnh hoặc bình luận, giao diện tự động gửi tín hiệu đồng bộ để cập nhật lại các chỉ số thống kê (Badge đếm) theo thời gian thực.

---

## 3. MÔ HÌNH DỮ LIỆU & THIẾT KẾ LƯỢC ĐỒ (DATABASE SCHEMA)

Ứng dụng sử dụng mô hình kết hợp giữa **Tham chiếu (Referencing)** và **Tài liệu nhúng (Embedded Documents)**:

```text
  ┌─────────────────────────┐                ┌───────────────────────────────────┐
  │          USERS          │                │              PHOTOS               │
  ├─────────────────────────┤                ├───────────────────────────────────┤
  │ _id: ObjectId           │ 1            N │ _id: ObjectId                     │
  │ login_name: String      │───────────────<│ file_name: String                 │
  │ password: String (Hash) │                │ date_time: Date                   │
  │ first_name: String      │                │ user_id: ObjectId (Ref: Users)    │
  │ last_name: String       │                │                                   │
  │ location: String        │                │ comments: [                       │
  │ occupation: String      │                │   {                               │
  │ description: String     │                │     _id: ObjectId,                │
  └─────────────────────────┘                │     comment: String,              │
                                             │     date_time: Date,              │
                                             │     user_id: ObjectId (Ref: Users)│
                                             │   }                               │
                                             │ ]                                 │
                                             └───────────────────────────────────┘
```

* **Lý do thiết kế:** Bình luận (Comments) được nhúng trực tiếp (Embedded) vào tài liệu Photo vì chúng luôn được truy xuất cùng bức ảnh khi hiển thị chi tiết bài đăng. Điều này giúp giảm thiểu thao tác `$lookup` tốn kém khi người dùng lướt xem thư viện ảnh.

---

## 4. LUỒNG XÁC THỰC & VÒNG ĐỜI PHIÊN ĐĂNG NHẬP (AUTH LIFECYCLE)

```text
   Người dùng                 Frontend Client                 Backend API                  MongoDB
       │                             │                             │                          │
       │─── 1. Nhập Form Login ─────►│                             │                          │
       │                             │─── 2. POST /api/auth/login ─►│                          │
       │                             │                             │── 3. findOne & bcrypt ──►│
       │                             │                             │◄─ 4. User data & hash ───│
       │                             │◄── 5. Trả JWT Token ────────│                          │
       │                             │    (Expires in 24h)         │                          │
       │                             │                             │                          │
       │                             │── 6. Lưu vào LocalStorage   │                          │
       │                             │                             │                          │
       │─── 7. Tải danh sách User ──►│                             │                          │
       │                             │── 8. GET /api/user/list ────►│                          │
       │                             │   (Header: Bearer <Token>)  │── 9. verifyToken check   │
       │                             │                             │── 10. Aggregation query ─►│
       │                             │◄── 11. Trả dữ liệu JSON ────│◄─ 12. Trả kết quả đếm ────│
       │◄── 13. Hiển thị UI ─────────│                             │                          │
```

---

## 5. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
Photo-sharing/
├── be/                         # Phân hệ Backend RESTful API
│   ├── images/                 # Thư mục lưu trữ media tĩnh (.gitkeep)
│   ├── src/
│   │   ├── configs/            # Kết nối cơ sở dữ liệu MongoDB Atlas
│   │   │   └── dbConnect.js
│   │   ├── controllers/        # Xử lý logic nghiệp vụ
│   │   │   ├── authController.js   # Đăng ký, Đăng nhập, Hashing Bcrypt
│   │   │   ├── photoController.js  # Lấy danh sách ảnh, Upload ảnh, Bình luận
│   │   │   └── userController.js   # Thống kê Aggregation, Xem hồ sơ người dùng
│   │   ├── middleware/         # Middleware bảo vệ route (JWT Auth)
│   │   │   └── authMiddleware.js
│   │   ├── models/             # Định nghĩa Mongoose Schemas
│   │   │   ├── userModel.js
│   │   │   └── photoModel.js
│   │   ├── routes/             # Định tuyến API
│   │   │   ├── AuthRouter.js
│   │   │   ├── PhotoRouter.js
│   │   │   └── UserRouter.js
│   │   └── index.js            # Entry point của máy chủ Express
│   ├── .env.example            # Mẫu cấu hình biến môi trường Backend
│   ├── .gitignore              # Bảo vệ biến môi trường và file upload
│   ├── README.md               # Hướng dẫn kỹ thuật Backend
│   └── package.json
│
├── fe/                         # Phân hệ Frontend Client (React SPA)
│   ├── public/                 # Static assets & index.html
│   ├── src/
│   │   ├── components/         # Các React Components
│   │   │   ├── Login/          # Giao diện Đăng nhập
│   │   │   ├── Register/       # Giao diện Đăng ký tài khoản
│   │   │   ├── TopBar/         # Thanh điều hướng trên cùng & Nút đăng ảnh
│   │   │   ├── UserList/       # Danh sách thành viên kèm Badge thống kê
│   │   │   ├── UserDetail/     # Xem thông tin chi tiết cá nhân
│   │   │   ├── UserPhotos/     # Dòng thời gian ảnh & Khối viết bình luận
│   │   │   └── UserComments/   # Trang tra cứu toàn bộ bình luận của 1 user
│   │   ├── lib/
│   │   │   └── fetchModelData.js # Utility gọi API với token interceptor
│   │   ├── config.js           # Quản lý Base URL và helper xử lý ảnh
│   │   ├── App.js              # Routing và Main Grid Layout
│   │   └── index.js
│   ├── .env.example            # Mẫu cấu hình môi trường Frontend
│   ├── .gitignore
│   └── package.json
│
├── .gitignore                  # Gitignore gốc (Bảo vệ .env và tệp tạm thời)
└── README.md                   # Tài liệu tổng quan toàn bộ dự án
```

---

## 6. DANH SÁCH REST API ENDPOINTS (8 ENDPOINTS)

Mọi phản hồi lỗi hoặc thông báo đều tuân thủ định dạng JSON nhất quán:
```json
{
  "message": "Nội dung phản hồi hoặc mô tả lỗi"
}
```

### 🔐 1. Phân hệ Xác thực (`/api/auth`)
| Method | Endpoint | Yêu cầu Auth | Mô tả nghiệp vụ |
| :---: | :--- | :---: | :--- |
| `POST` | `/api/auth/user` | ❌ Public | Đăng ký tài khoản người dùng mới (mã hóa mật khẩu) |
| `POST` | `/api/auth/login` | ❌ Public | Xác thực đăng nhập và nhận JSON Web Token (24h) |

### 👤 2. Phân hệ Người dùng (`/api/user`)
| Method | Endpoint | Yêu cầu Auth | Mô tả nghiệp vụ |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/user/list` | ✅ Bearer JWT | Lấy danh sách thành viên kèm số ảnh và số bình luận (Aggregation) |
| `GET` | `/api/user/:id` | ✅ Bearer JWT | Xem thông tin chi tiết hồ sơ của một người dùng |
| `GET` | `/api/user/commentsOfUser/:id` | ✅ Bearer JWT | Tra cứu tất cả bình luận do người dùng này viết trên toàn hệ thống |

### 🖼️ 3. Phân hệ Hình ảnh & Tương tác (`/api/photo`)
| Method | Endpoint | Yêu cầu Auth | Mô tả nghiệp vụ |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/photo/photosOfUser/:id` | ✅ Bearer JWT | Lấy toàn bộ ảnh của một người dùng kèm danh sách bình luận |
| `POST` | `/api/photo/new` | ✅ Bearer JWT | Tải lên bức ảnh mới (`multipart/form-data`, trường `photo`) |
| `POST` | `/api/photo/commentsOfPhoto/:photo_id` | ✅ Bearer JWT | Thêm một bình luận mới vào bức ảnh |

---

## 7. HƯỚNG DẪN CÀI ĐẶT & CHẠY THỬ NHANH

### Yêu cầu tiên quyết
* Node.js >= 18.x
* Quản lý gói: `npm`
* Cơ sở dữ liệu MongoDB Atlas hoặc MongoDB Server Local

---

### Bước 1: Khởi động Backend API

1. Mở terminal và di chuyển vào thư mục `be`:
   ```bash
   cd be
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Tạo file biến môi trường `.env`:
   ```bash
   cp .env.example .env
   ```
   *Cấu hình thông số kết nối cơ sở dữ liệu và mã bí mật JWT trong `be/.env`:*
   ```env
   PORT=3001
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.hez1oqh.mongodb.net/photo_sharing?retryWrites=true&w=majority
   SECRET_KEY=your_secret_key_here
   ```
4. Khởi chạy máy chủ Backend:
   ```bash
   # Chạy chế độ phát triển (tự động reload khi sửa code):
   npm run dev

   # Hoặc chạy chế độ thông thường:
   npm start
   ```
   *Máy chủ sẽ lắng nghe tại: `http://localhost:3001` (Kiểm tra trạng thái tại `GET http://localhost:3001/`)*

---

### Bước 2: Khởi động Frontend Client

1. Mở một cửa sổ terminal mới và di chuyển vào thư mục `fe`:
   ```bash
   cd fe
   ```
2. Cài đặt các thư viện phụ thuộc:
   ```bash
   npm install
   ```
3. Tạo file biến môi trường `.env`:
   ```bash
   cp .env.example .env
   ```
   *Nội dung cấu hình `fe/.env`:*
   ```env
   REACT_APP_API_URL=http://localhost:3001
   ```
4. Khởi chạy ứng dụng React:
   ```bash
   npm start
   ```
   *Trình duyệt sẽ tự động mở giao diện tại: `http://localhost:3000`*

---

## 8. LỘ TRÌNH MỞ RỘNG (FUTURE ROADMAP)

- [ ] **Lưu trữ đám mây (Cloud Storage):** Chuyển đổi từ lưu trữ tệp cục bộ trên đĩa máy chủ (`be/images/`) sang Object Storage như **AWS S3** hoặc **Cloudinary** nhằm đảm bảo tính phi trạng thái (Stateless) khi mở rộng nhiều máy chủ.
- [ ] **Phân trang dữ liệu ảnh (Cursor/Offset Pagination):** Áp dụng phân trang theo trang hoặc infinite scroll cho thư viện ảnh lớn nhằm tối ưu băng thông mạng.
- [ ] **Tương tác Thả tim / Yêu thích (Photo Likes):** Bổ sung trường `likes: [ObjectId]` hỗ trợ tương tác phản ứng bài đăng.
- [ ] **Tách bảng Bình luận độc lập:** Khi số lượng bình luận trên mỗi bức ảnh tăng cao vượt giới hạn tài liệu BSON 16MB của MongoDB, tách Collection `Comments` riêng biệt và thiết lập chỉ mục (Indexes) trên `photo_id`.

---

## 9. THÔNG TIN TÁC GIẢ

* **Họ và tên:** Đào Duy Hải
* **Vai trò:** Backend Developer Intern
* **GitHub:** [@DaoDuyHai](https://github.com/DaoDuyHai)
* **Dự án:** Photo Sharing & Interaction Platform (Fullstack End-to-End MERN Application)
