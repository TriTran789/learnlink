import { Request, Response } from "express";
import prisma from "../prisma";

export const createSubject = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const existingSubject = await prisma.subject.findFirst({
      where: { name },
    });

    if (existingSubject) {
      res.status(400).json({ message: "Subject already exists" });
      return;
    }

    await prisma.subject.create({
      data: {
        name,
      },
    });

    res.status(200).json({ message: "Subject created successfully" });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await prisma.subject.findMany();
    res
      .status(200)
      .json({ message: "Subjects fetched successfully", data: subjects });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.subject.delete({
      where: { id },
    });

    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const existingSubject = await prisma.subject.findFirst({
      where: { id },
    });

    if (!existingSubject) {
      res.status(404).json({ message: "Subject not found" });
      return;
    }

    await prisma.subject.update({
      where: { id },
      data: { name },
    });

    res.status(200).json({ message: "Subject updated successfully" });
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
