import axios from "axios";
import api from "./api";

export const signInApi = async (payload: {
  email: string;
  password: string;
}): Promise<{
  success: boolean;
  message: string;
  accessToken: string;
}> => {
  try {
    const response = await api.post("/sign-in", payload);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const checkTokenApi = async (): Promise<{
  success: boolean;
  message: string;
  accessToken: string;
}> => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/refresh-token`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    // console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const signOutApi = async () => {
  try {
    const response = await api.post("/sign-out");
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const CheckFaceApi = async (base64Image: string) => {
  try {
    const response = await api.post("/check-face", {
      image: base64Image,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const changePasswordApi = async (payload: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}) => {
  try {
    const response = await api.post("/change-password", payload);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
