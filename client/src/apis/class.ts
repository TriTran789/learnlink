import { Class, ClassDetail, PayloadClass, Student } from "@/types";
import api from "./api";

export const createClassApi = async (payload: PayloadClass) => {
  try {
    const response = await api.post("/class", payload);
    return response.data;
  } catch (error: any) {
    console.error("Error creating class:", error);
    throw new Error(error.response.data.message);
  }
};

export const getAllClassesApi = async (): Promise<Class[]> => {
  try {
    const response = await api.get("/class");
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching classes:", error);
    throw new Error(error.response.data.message);
  }
};

export const getClassDetailApi = async (id: string): Promise<ClassDetail> => {
  try {
    const response = await api.get(`/class/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching class detail:", error);
    throw new Error(error.response.data.message);
  }
};

export const getStudentForClassApi = async (
  classId: string
): Promise<{
  message: string;
  studentsInClass: Student[];
  studentsNotInClass: Student[];
}> => {
  try {
    const response = await api.get(`/class/${classId}/students`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching students for class:", error);
    throw new Error(error.response.data.message);
  }
};

export const addStudentToClassApi = async (
  classId: string,
  students: { students: string[] }
) => {
  try {
    const response = await api.post(`/class/${classId}/add-students`, students);
    return response.data;
  } catch (error: any) {
    console.error("Error adding students to class:", error);
    throw new Error(error.response.data.message);
  }
};

export const deleteStudentFromClassApi = async (
  classId: string,
  studentId: string
) => {
  try {
    const response = await api.delete(`/class/${classId}/student/${studentId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error deleting student from class:", error);
    throw new Error(error.response.data.message);
  }
};
