import { Request, Response } from "express";
import { streamClient } from "../services/stream";

export const createLesson = async (req: Request, res: Response) => {
  try {
    const token = streamClient.createToken("zxcvbnm");

    res.status(201).json({
      message: "Lesson created successfully",
      token,
    });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
