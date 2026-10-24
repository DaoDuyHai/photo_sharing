import mongoose from "mongoose";
import Photo from "../models/photoModel.js";

// 1. LẤY DANH SÁCH ẢNH CỦA MỘT USER
export const getPhoto = async (request, response) => {
  const userId = request.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return response.status(400).json({ message: "ID người dùng không hợp lệ" });
  }

  try {
    const photos = await Photo.find({ user_id: userId })
      .sort({ date_time: -1 })
      .populate({
        path: "comments.user_id",
        model: "Users",
        select: "_id first_name last_name",
      })
      .lean();

    return response.status(200).json(photos);
  } catch (error) {
    console.error("Lỗi truy vấn ảnh:", error);
    return response.status(500).json({ message: "Lỗi hệ thống khi tải ảnh", error });
  }
};

// 2. THÊM BÌNH LUẬN VÀO ẢNH
export const addComment = async (request, response) => {
  const photoId = request.params.photo_id;
  const { comment } = request.body;

  if (!comment || typeof comment !== "string" || comment.trim() === "") {
    return response.status(400).json({ message: "Nội dung bình luận không được để trống" });
  }

  if (!mongoose.Types.ObjectId.isValid(photoId)) {
    return response.status(400).json({ message: "ID ảnh không hợp lệ" });
  }

  try {
    const photo = await Photo.findById(photoId);

    if (!photo) {
      return response.status(404).json({ message: "Không tìm thấy ảnh" });
    }

    photo.comments.push({
      comment: comment.trim(),
      date_time: new Date(),
      user_id: request.user.userId,
    });

    await photo.save();

    const updatedPhoto = await Photo.findById(photoId).populate({
      path: "comments.user_id",
      model: "Users",
      select: "_id first_name last_name",
    });

    return response.status(200).json(updatedPhoto);
  } catch (error) {
    console.error("Lỗi khi thêm bình luận:", error);
    return response.status(500).json({ message: "Lỗi hệ thống khi gửi bình luận" });
  }
};

// 3. TẢI ẢNH MỚI LÊN (UPLOAD PHOTO)
export const addPhoto = async (request, response) => {
  if (!request.file) {
    return response.status(400).json({ message: "Vui lòng chọn file ảnh để tải lên" });
  }

  try {
    const newPhoto = await Photo.create({
      file_name: request.file.filename,
      date_time: new Date(),
      user_id: request.user.userId,
      comments: [],
    });

    return response.status(201).json(newPhoto);
  } catch (error) {
    console.error("Lỗi lưu ảnh vào Database:", error);
    return response.status(500).json({ message: "Lỗi hệ thống khi lưu trữ thông tin ảnh", error });
  }
};
