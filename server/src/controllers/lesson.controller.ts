import { Request, Response } from "express";
import prisma from "../prisma";
import { streamClient } from "../services/stream";

export const createLesson = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const { name, start_time, end_time, content } = req.body;

    await prisma.lesson.create({
      data: {
        name,
        startAt: new Date(start_time),
        endAt: new Date(end_time),
        content,
        classId,
      },
    });

    res.status(201).json({
      message: "Lesson created successfully",
      data: req.body,
      classId,
    });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLessons = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;

    const lessons = await prisma.lesson.findMany({
      where: {
        classId,
      },
    });

    res.status(200).json({
      message: "Lessons retrieved successfully",
      data: lessons,
    });
  } catch (error) {
    console.error("Error retrieving lessons:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getLessonDetail = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }

    res.status(200).json({
      message: "Lesson retrieved successfully",
      data: lesson,
    });
  } catch (error) {
    console.error("Error retrieving lesson detail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const makeCall = async (req: Request, res: Response) => {
  try {
    const { userId, lessonId } = req.body;

    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
      },
    });

    if (!lesson) {
      res.status(404).json({ message: "Lesson not found" });
      return;
    }

    if (new Date() < new Date(lesson.startAt)) {
      res.status(400).json({
        message: "The lesson has not started",
      });
      return;
    }

    if (new Date() > new Date(lesson.endAt)) {
      res.status(400).json({
        message: "The lesson has ended",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        student: true,
        teacher: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const token = streamClient.createToken(userId);

    const data = {
      token,
      user: {
        id: userId,
        name: user.student?.fullName || user.teacher?.fullName,
        image: user.student?.imageUrl,
      },
    };
    res.status(200).json({
      message: "Make call successfull",
      data,
    });
  } catch (error) {
    console.error("Error creating call:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getRecord = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;

    const records = streamClient.video.call("default", lessonId);

    const data = await records.listRecordings();

    res.status(200).json({
      message: "Lesson records retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Error retrieving lesson records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
