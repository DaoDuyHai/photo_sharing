import express from "express";
import multer from "multer";
import path from "path";
import {
  addPhoto,
  getPhoto,
  addComment,
} from "../controllers/photoController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.originalname
      .replace(ext, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    cb(null, `UPLOADS_${Date.now()}_${safeName}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ chấp nhận tệp định dạng hình ảnh!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.get("/photosOfUser/:id", getPhoto);
router.post("/commentsOfPhoto/:photo_id", addComment);
router.post("/new", upload.single("photo"), addPhoto);

export default router;
