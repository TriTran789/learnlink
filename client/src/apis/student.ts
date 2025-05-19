import { PayloadUpdateStudent, Student } from "@/types";
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

export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const response = await api.get("/get-all-students");
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const deleteStudentApi = async (id: string) => {
  try {
    const response = await api.delete(`/delete-student/${id}`);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const editStudentApi = async (
  id: string,
  payload: PayloadUpdateStudent
) => {
  try {
    const response = await api.put(`/update-student/${id}`, payload);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
