import PATH from "@/constants/PATH";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      const originalRequest = error.config;

      if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
            {},
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          localStorage.setItem("accessToken", data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("accessToken");
          window.location.href = PATH.SIGN_IN;
          return Promise.reject(refreshError);
        }
      }

      localStorage.removeItem("accessToken");
      window.location.href = PATH.SIGN_IN;
    }
    return Promise.reject(error);
  }
);

export default api;
