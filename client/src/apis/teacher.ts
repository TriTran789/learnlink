import { Teacher } from "@/types";
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

export const getTeachers = async (): Promise<Teacher[]> => {
  try {
    const response = await api.get("/get-teachers");
    return response.data.teachers;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const deleteTeacherApi = async (
  id: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.delete(`/delete-teacher/${id}`);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const updateTeacherApi = async (
  id: string,
  payload: { fullName: string; phone: string; level: string }
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await api.put(`/update-teacher/${id}`, payload);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
