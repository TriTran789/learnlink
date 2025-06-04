import { Exam, ExamDetail, ExamToDo, PayloadExam } from "@/types";
import api from "./api";

export const createExamApi = async (payload: PayloadExam) => {
  try {
    const response = await api.post(`/exam`, payload);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const getExamsApi = async (classId: string): Promise<Exam[]> => {
  try {
    const response = await api.get(`/exam?classId=${classId}`);
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const getExamDetailApi = async (examId: string): Promise<ExamDetail> => {
  try {
    const response = await api.get(`/exam/${examId}`);
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const submitExamApi = async ({
  examId,
  data,
}: {
  examId: string;
  data: { questions: { answer?: string }[] };
}) => {
  try {
    const response = await api.post(`/submit-exam/${examId}`, data.questions);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const getExamToDoApi = async (examId: string): Promise<ExamToDo> => {
  try {
    const response = await api.get(`/exam/${examId}/todo`);
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
