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
    // const teachers = await prisma.teacher.findMany();

    const data = await prisma.user.findMany({
      where: {
        role: "TEACHER",
      },
      select: {
        id: true,
        teacher: true,
      },
    });

    const teachers = data.map((item) => {
      const teacher = item.teacher;

      const id = teacher?.id;

      return {
        userId: item.id,
        teacherId: id,
        fullName: teacher?.fullName,
        level: teacher?.level,
        phone: teacher?.phone,
      };
    });

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

export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        teacher: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const classes = await prisma.class.findMany({
      where: {
        teacherId: user.teacher?.id,
      },
    });

    if (classes.length > 0) {
      res.status(400).json({
        success: false,
        message: "Cannot delete teacher with existing classes",
      });
      return;
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    user.teacherId &&
      (await prisma.teacher.delete({
        where: {
          id: user.teacherId,
        },
      }));

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, level, phone } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: {
        id,
      },
    });

    if (!teacher) {
      res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
      return;
    }

    await prisma.teacher.update({
      where: {
        id,
      },
      data: {
        fullName,
        level,
        phone,
      },
    });

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
