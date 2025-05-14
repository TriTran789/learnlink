import api from "./api";

export const createStudentApi = async (payload: {
  fullName: string;
  email: string;
  phone: string;
  image: string;
}) => {
  try {
    const response = await api.post("/create-student", payload);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
