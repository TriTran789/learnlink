import { Request, Response } from "express";
import prisma from "../prisma";

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { examId, content, a, b, c, d, answer } = req.body;

    const exam = await prisma.exam.findUnique({
      where: {
        id: examId,
      },
    });

    if (!exam) {
      res.status(404).json({
        message: "Exam not found",
      });
      return;
    }

    if (new Date(exam.startAt) < new Date()) {
      res.status(400).json({
        message: "Exam has started",
      });
      return;
    }

    const question = await prisma.question.create({
      data: {
        content,
        examId,
      },
    });

    await prisma.answer.createMany({
      data: [
        {
          content: a,
          questionId: question.id,
          isCorrect: answer === "a",
        },
        {
          content: b,
          questionId: question.id,
          isCorrect: answer === "b",
        },
        {
          content: c,
          questionId: question.id,
          isCorrect: answer === "c",
        },
        {
          content: d,
          questionId: question.id,
          isCorrect: answer === "d",
        },
      ],
    });

    res.status(201).json({
      message: "Create question successfully",
      exam,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const { questionId } = req.params;

    const question = await prisma.question.findUnique({
      where: {
        id: questionId,
      },
      include: {
        answers: true,
        exam: true,
      },
    });

    if (!question) {
      res.status(404).json({
        message: "Question not found",
      });
      return;
    }

    if (new Date(question.exam.startAt) < new Date()) {
      res.status(400).json({
        message: "Exam has started",
      });
      return;
    }

    question.answers.map(async (answer) => {
      await prisma.answer.delete({
        where: {
          id: answer.id,
        },
      });
    });

    await prisma.question.delete({
      where: {
        id: questionId,
      },
    });

    res.status(200).json({
      message: "Delete question successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
