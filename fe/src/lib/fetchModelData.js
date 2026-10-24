import { API_BASE_URL } from "../config";

/**
 * Utility hàm gọi API tập trung cho ứng dụng
 * Tự động gắn Token xác thực JWT và Base URL
 */
async function fetchModel(url, options = { method: "GET", body: null }) {
  let targetUrl = url;

  // Chuẩn hóa URL sang API_BASE_URL của dự án
  if (targetUrl.startsWith("/")) {
    targetUrl = `${API_BASE_URL}${targetUrl}`;
  } else if (targetUrl.includes("csb.app")) {
    try {
      const urlObj = new URL(targetUrl);
      targetUrl = `${API_BASE_URL}${urlObj.pathname}${urlObj.search}`;
    } catch {
      targetUrl = targetUrl.replace(/https:\/\/[^/]+/, API_BASE_URL);
    }
  }

  const method = (options.method || "GET").toUpperCase();
  const headers = {};

  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let body = null;
  if (options.body) {
    if (options.body instanceof FormData) {
      body = options.body;
      // Trình duyệt tự thiết lập Content-Type kèm boundary cho FormData
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(options.body);
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    const contentType = response.headers.get("content-type");
    let responseData = null;

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      try {
        responseData = JSON.parse(text);
      } catch {
        responseData = text;
      }
    }

    if (response.ok) {
      return { data: responseData };
    } else {
      // Trường hợp token hết hạn
      if (response.status === 401) {
        console.warn("Phiên đăng nhập đã hết hạn hoặc không hợp lệ");
      }
      const errorMsg =
        (responseData && (responseData.message || responseData.error)) ||
        responseData ||
        `Lỗi HTTP: ${response.status}`;
      return Promise.reject({ status: response.status, message: errorMsg, data: responseData });
    }
  } catch (err) {
    return Promise.reject({
      status: 500,
      message: err.message || "Không thể kết nối đến máy chủ",
    });
  }
}

export default fetchModel;
