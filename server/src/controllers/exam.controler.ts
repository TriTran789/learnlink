import { Request, Response } from "express";
import prisma from "../prisma";

export const createExam = async (req: Request, res: Response) => {
  try {
    const { classId, name, duration, startAt, endAt } = req.body;

    await prisma.exam.create({
      data: {
        classId,
        name,
        duration,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
      },
    });

    res.status(201).json({
      message: "Exam created successfully",
    });
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getExams = async (req: Request, res: Response) => {
  try {
    const { classId } = req.query;

    const exams = await prisma.exam.findMany({
      where: {
        classId: classId as string,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      data: exams,
      message: "Exams fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching exams:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getExamDetail = async (req: Request, res: Response) => {
  try {
    const { examId } = req.params;

    const exam = await prisma.exam.findUnique({
      where: {
        id: examId,
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!exam) {
      res.status(404).json({ message: "Exam not found" });
      return;
    }

    res.status(200).json({
      data: exam,
      message: "Exam fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching exam detail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
