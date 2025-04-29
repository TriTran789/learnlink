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