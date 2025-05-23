export interface Teacher {
  userId: string;
  teacherId: string;
  fullName: string;
  phone: string;
  level: string;
}

export type Student = {
  id: string;
  fullName: string;
  phone: string;
  imageUrl: string;
  publicId: string;
};

export type PayloadUpdateStudent = {
  fullName: string;
  phone: string;
  newImage?: string;
};

export type Subject = {
  id: string;
  name: string;
};

export type PayloadClass = {
  teacher_id: string;
  subject_id: string;
  name: string;
};

export type Class = {
  id: string;
  name: string;
  teacher_name: string;
  subject_name: string;
};

export type ClassDetail = {
  id: string;
  name: string;
  teacherId: string;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
  teaccher_name: string;
  subject_name: string;
};

export type PayloadLesson = {
  name: string;
  start_time: Date;
  end_time: Date;
  content?: string | undefined;
};

export type Lesson = {
  id: string;
  name: string;
  content: string;
  classId: string;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
};

export type PayloadExam = {
  name: string;
  classId: string;
  startAt: Date;
  endAt: Date;
  duration: number;
};

export type Exam = {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
  duration: number;
  classId: string;
  createdAt: string;
  updatedAt: string;
};

export type ExamDetail = {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
  duration: number;
  classId: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
};

export interface Question {
  id: string;
  content: string;
  examId: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  content: string;
  isCorrect: boolean;
  questionId: string;
}

export type PayloadQuestion = {
  examId: string;
  content: string;
  a: string;
  b: string;
  c: string;
  d: string;
  answer: "a" | "b" | "c" | "d";
};