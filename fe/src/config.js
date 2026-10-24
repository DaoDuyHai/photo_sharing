/**
 * Cấu hình biến môi trường và Endpoint API tập trung cho Frontend
 */
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001";

/**
 * Trả về đường dẫn đầy đủ tới file ảnh tải lên
 * @param {string} fileName Tên file ảnh
 */
export const getImageUrl = (fileName) => {
  if (!fileName) return "";
  return `${API_BASE_URL}/images/${fileName}`;
};

