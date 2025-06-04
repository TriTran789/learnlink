import { Request, Response } from "express";
import prisma from "../prisma";
import { JWTPayload } from "../types";

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

export const submitExam = async (req: Request, res: Response) => {
  try {
    const { examId } = req.params;
    const data = req.body;
    const { profileId } = req.user as JWTPayload;

    const questionsCount = await prisma.question.count({
      where: {
        examId,
      },
    });

    if (questionsCount === 0) {
      res.status(400).json({ message: "Exam is not existed" });
      return;
    }

    let correctAnswers = 0;

    for (const item of data) {
      if (item.answer) {
        const answer = await prisma.answer.findUnique({
          where: {
            id: item.answer,
          },
        });

        if (answer && answer.isCorrect) {
          correctAnswers++;
        }
      }
    }

    const result = await prisma.result.create({
      data: {
        examId,
        studentId: profileId,
        score: Number((correctAnswers / questionsCount).toFixed(2)),
      },
    });

    for (const item of data) {
      if (item.answer) {
        const answer = await prisma.answer.findUnique({
          where: {
            id: item.answer,
          },
          include: {
            question: {
              select: {
                id: true,
              },
            },
          },
        });

        if (answer) {
          await prisma.studentAnswer.create({
            data: {
              resultId: result.id,
              answerId: answer.id,
            },
          });
        }
      }
    }

    res.status(200).json({
      message: "Exam submitted successfully",
    });
  } catch (error) {
    console.error("Error submitting exam:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getExamTodo = async (req: Request, res: Response) => {
  try {
    const { examId } = req.params;

    const exam = await prisma.exam.findUnique({
      where: {
        id: examId,
      },
      include: {
        questions: {
          include: {
            answers: {
              select: {
                id: true,
                content: true,
              },
            },
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
      message: "Exam to do fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching exam to do:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
