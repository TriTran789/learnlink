import { PayloadQuestion } from "@/types";
import api from "./api";

export const createQuestionApi = async (payload: PayloadQuestion) => {
  try {
    const response = await api.post("/question", payload);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};

export const deleteQuestionApi = async (id: string) => {
  try {
    const response = await api.delete(`/question/${id}`);
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.response.data.message);
  }
};
