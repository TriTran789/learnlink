import { Request, Response } from "express";
import sendMail from "../utils/sendMail";
import prisma from "../prisma";
import { generateHTML, generateRandomString } from "../utils";
import { genSaltSync, hashSync } from "bcryptjs";

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const { fullName, email, level, phone } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const password = generateRandomString();

    const teacher = await prisma.teacher.create({
      data: {
        fullName,
        level,
        phone,
      },
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashSync(password, genSaltSync(10)),
        role: "TEACHER",
        teacherId: teacher.id,
      },
    });

    await sendMail(email, generateHTML("Teacher", password));

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getTeachers = async (req: Request, res: Response) => {
  try {
    const teachers = await prisma.teacher.findMany();

    res.status(200).json({
      success: true,
      message: "Teachers fetched successfully",
      teachers,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
