import { getAccessToken } from "@/lib/localStorage";
import axios from "axios";
import { refreshAccessToken } from "./auth";

// Tạo instance của Axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // URL của backend
  withCredentials: true, // Cho phép gửi cookie (refresh token) cùng yêu cầu
});

// Interceptor cho request: Thêm access token vào header
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho response: Xử lý lỗi 401 và làm mới token
apiClient.interceptors.response.use(
  (response) => response, // Trả về response nếu thành công
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu lỗi là 401 và chưa thử làm mới token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Đánh dấu đã thử làm mới

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest); // Thử lại yêu cầu ban đầu với token mới
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
