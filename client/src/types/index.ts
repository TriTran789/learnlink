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
