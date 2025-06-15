import {
  Exam,
  ExamDetail,
  ExamToDo,
  PayloadExam,
  ResultStudent,
} from "@/types";
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
  warning,
  data,
}: {
  examId: string;
  warning: number;
  data: { questions: { answer?: string }[] };
}) => {
  try {
    const response = await api.post(`/submit-exam/${examId}/${warning}`, data.questions);
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

export const checkExamApi = async (examId: string) => {
  try {
    const response = await api.get(`/exam/${examId}/check`);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const getExamResultApi = async (
  examId: string
): Promise<ResultStudent> => {
  try {
    const response = await api.get(`/exam/${examId}/result`);
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const getResultTotalApi = async (examId: string) => {
  try {
    const response = await api.get(`/exam/${examId}/result-total`);
    return response.data.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
