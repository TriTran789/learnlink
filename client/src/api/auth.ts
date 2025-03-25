import axios from "axios";
import apiClient from "./apiClient";
import { setAccessToken } from "@/lib/localStorage";
import PATH from "@/contants/Path";

export const signInApi = async (payload: {
  email: string;
  password: string;
}): Promise<{
  message: string;
  accessToken: string;
}> => {
  try {
    const response = await apiClient.post("/auth/sign-in", payload);
    setAccessToken(response.data.accessToken);
    return response.data.data;
  } catch (error: any) {
    console.error("Đăng nhập không thành công:", error);
    throw new Error(error.response.data.message);
  }
};

// Hàm làm mới access token
export const refreshAccessToken = async (): Promise<{
  success: boolean;
  accessToken: string;
}> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
    const newAccessToken = response.data.accessToken;
    localStorage.setItem("accessToken", newAccessToken);
    return response.data;
  } catch (error) {
    console.error("Không thể làm mới token:", error);
    localStorage.removeItem("accessToken");
    window.location.href = "/sign-in"; // Chuyển hướng đến trang đăng nhập
    throw error;
  }
};

export const checkAuthStatus = async (): Promise<{
  success: boolean;
  accessToken: string;
}> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    const newAccessToken = response.data.accessToken;
    localStorage.setItem("accessToken", newAccessToken);
    return response.data;
  } catch (error) {
    console.error("Không thể làm mới token:", error);
    localStorage.removeItem("accessToken");
    throw error;
  }
};

export const signOutApi = async () => {
  try {
    await apiClient.get("/auth/logout");
    localStorage.removeItem("accessToken");
    window.location.href = PATH.HOME;
  } catch (error: any) {
    console.error("Đăng xuất không thành công:", error);
    throw new Error(error.response.data.message);
  }
};
