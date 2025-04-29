import api from "./api";

export const createTeacherApi = async (payload: {
  fullName: string;
  email: string;
  phone: string;
  level: string;
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.post("/create-teacher", payload);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
