import mongoose from "mongoose";
import User from "../models/userModel.js";
import Photo from "../models/photoModel.js";

/**
 * Lấy danh sách toàn bộ người dùng kèm số lượng ảnh và số lượng bình luận
 * Tối ưu hóa bằng MongoDB Aggregation Pipeline (tránh N+1 query và không tải toàn bộ ảnh vào RAM)
 */
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("_id first_name last_name").lean();

    // 1. Đếm số lượng ảnh của từng user trực tiếp trên MongoDB
    const photoCounts = await Photo.aggregate([
      { $group: { _id: "$user_id", count: { $sum: 1 } } },
    ]);

    // 2. Đếm số lượng bình luận của từng user trực tiếp trên MongoDB
    const commentCounts = await Photo.aggregate([
      { $unwind: "$comments" },
      { $group: { _id: "$comments.user_id", count: { $sum: 1 } } },
    ]);

    const photoCountMap = new Map(
      photoCounts.map((item) => [item._id?.toString(), item.count])
    );
    const commentCountMap = new Map(
      commentCounts.map((item) => [item._id?.toString(), item.count])
    );

    const extendedUserList = users.map((u) => {
      const uId = u._id.toString();
      return {
        _id: u._id,
        first_name: u.first_name,
        last_name: u.last_name,
        photoCount: photoCountMap.get(uId) || 0,
        commentCount: commentCountMap.get(uId) || 0,
      };
    });

    return res.status(200).json(extendedUserList);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách user:", error);
    return res.status(500).json({ message: "Lỗi hệ thống khi tải danh sách người dùng" });
  }
};

/**
 * Lấy thông tin chi tiết một người dùng theo ID
 */
export const getDetailUser = async (request, response) => {
  const { id } = request.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ message: "ID người dùng không hợp lệ" });
  }

  try {
    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      return response.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    return response.status(200).json(user);
  } catch (error) {
    console.error("Lỗi lấy chi tiết User:", error);
    return response.status(500).json({ message: "Lỗi hệ thống khi tải thông tin người dùng" });
  }
};

/**
 * Lấy danh sách bình luận do một người dùng đăng trên mọi bức ảnh
 * Tối ưu hóa bằng MongoDB Aggregation Pipeline
 */
export const getUserComments = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID người dùng không hợp lệ" });
    }

    const targetUserId = new mongoose.Types.ObjectId(id);

    const result = await Photo.aggregate([
      { $unwind: "$comments" },
      { $match: { "comments.user_id": targetUserId } },
      {
        $project: {
          _id: 0,
          commentText: "$comments.comment",
          dateTime: "$comments.date_time",
          photoFile: "$file_name",
          photoUserId: "$user_id",
        },
      },
      { $sort: { dateTime: -1 } },
    ]);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi lấy danh sách bình luận của user:", error);
    return res.status(500).json({ message: "Lỗi hệ thống khi lấy bình luận" });
  }
};
