import { Lesson, PayloadLesson } from "@/types";
import api from "./api";

export const createLessonApi = async (
  classId: string,
  payload: PayloadLesson
) => {
  try {
    const response = await api.post(`/class/${classId}/lesson`, payload);
    return response.data;
  } catch (error: any) {
    console.error("Error creating lesson:", error);
    throw new Error(error.response.data.message);
  }
};

export const getLessonsApi = async (classId: string): Promise<Lesson[]> => {
  try {
    const response = await api.get(`/class/${classId}/lesson`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching lessons:", error);
    throw new Error(error.response.data.message);
  }
};

export const getLessonDetailApi = async (lessonId: string): Promise<Lesson> => {
  try {
    const response = await api.get(`/lesson/${lessonId}`);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching lesson detail:", error);
    throw new Error(error.response.data.message);
  }
};

export const getCallApi = async (payload: {
  userId: string;
  lessonId: string;
}): Promise<{
  token: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
}> => {
  try {
    const response = await api.post(`/lesson/call`, payload);
    return response.data.data;
  } catch (error: any) {
    console.error("Error fetching call:", error);
    throw new Error(error.response.data.message);
  }
};

export const getRecordApi = async (
  lessonId: string
): Promise<
  {
    filename: string;
    url: string;
    start_time: string;
    end_time: string;
    session_id: string;
  }[]
> => {
  try {
    const response = await api.get(`/lesson/${lessonId}/record`);
    return response.data.data.recordings;
  } catch (error: any) {
    console.error("Error fetching lesson record:", error);
    throw new Error(error.response.data.message);
  }
};
