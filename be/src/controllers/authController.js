import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const getJwtSecret = () =>
  process.env.SECRET_KEY || process.env.JWT_SECRET || "photo_sharing_default_secret";

export const signIn = async (req, res) => {
  const { login_name, password } = req.body;

  if (!login_name || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu" });
  }

  try {
    const user = await User.findOne({ login_name: login_name.trim() });
    if (!user) {
      return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không chính xác" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Tên đăng nhập hoặc mật khẩu không chính xác" });
    }

    const token = jwt.sign({ userId: user._id }, getJwtSecret(), {
      expiresIn: "24h",
    });

    return res.status(200).json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      occupation: user.occupation,
      location: user.location,
      description: user.description,
      token: token,
    });
  } catch (err) {
    console.error("Lỗi đăng nhập:", err);
    return res.status(500).json({ message: "Lỗi hệ thống khi đăng nhập" });
  }
};

export const signUp = async (req, res) => {
  const {
    login_name,
    password,
    first_name,
    last_name,
    location = "",
    description = "",
    occupation = "",
  } = req.body;

  if (!login_name || !password || !first_name || !last_name) {
    return res.status(400).json({
      message: "Thiếu thông tin bắt buộc (login_name, password, first_name, last_name)",
    });
  }

  try {
    const trimmedLoginName = login_name.trim();
    const existingUser = await User.findOne({ login_name: trimmedLoginName });
    if (existingUser) {
      return res.status(400).json({
        message: "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      login_name: trimmedLoginName,
      password: hashedPassword,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      location: location.trim(),
      description: description.trim(),
      occupation: occupation.trim(),
    });

    return res.status(201).json({
      message: "Đăng ký tài khoản thành công",
      userId: newUser._id,
    });
  } catch (err) {
    console.error("Lỗi đăng ký:", err);
    return res.status(500).json({ message: "Lỗi máy chủ khi đăng ký người dùng" });
  }
};
