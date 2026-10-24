import jwt from "jsonwebtoken";

const getJwtSecret = () =>
  process.env.SECRET_KEY || process.env.JWT_SECRET || "photo_sharing_default_secret";

const verifyToken = (request, response, next) => {
  if (request.path === "/") return next();

  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return response.status(401).json({ message: "Truy cập bị từ chối: Không tìm thấy Token xác thực" });
  }

  jwt.verify(token, getJwtSecret(), (err, decoded) => {
    if (err) {
      return response.status(401).json({ message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn" });
    }

    request.user = decoded;
    next();
  });
};

export default verifyToken;
