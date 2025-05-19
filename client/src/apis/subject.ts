import { Subject } from "@/types";
import api from "./api";

export const createSubjectApi = async (payload: { name: string }) => {
  try {
    const response = await api.post("/create-subject", payload);
    return response.data;
  } catch (error: any) {
    console.error("Error creating subject:", error);
    throw new Error(error.response.data.message);
  }
};

export const getAllSubjectsApi = async (): Promise<Subject[]> => {
  try {
    const response = await api.get("/get-subjects");
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching subjects:", error);
    throw new Error(error.response.data.message);
  }
};

export const deleteSubjectApi = async (id: string) => {
  try {
    const response = await api.delete(`/delete-subject/${id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting subject:", error);
    throw new Error(error.response.data.message);
  }
};

export const updateSubjectApi = async (
  id: string,
  payload: { name: string }
) => {
  try {
    const response = await api.put(`/update-subject/${id}`, payload);
    return response.data;
  } catch (error: any) {
    console.error("Error updating subject:", error);
    throw new Error(error.response.data.message);
  }
};
