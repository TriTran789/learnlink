import { Request, Response } from "express";
import prisma from "../prisma";

export const createClass = async (req: Request, res: Response) => {
  try {
    const { teacher_id, subject_id, name } = req.body;

    const existingClass = await prisma.class.findFirst({
      where: {
        name,
      },
    });

    if (existingClass) {
      res.status(400).json({
        message: "Class with this name already exists",
      });
      return;
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        subject: {
          connect: {
            id: subject_id,
          },
        },
        teacher: {
          connect: {
            id: teacher_id,
          },
        },
      },
    });

    res.status(201).json({
      message: "Class created successfully",
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        teacher: true,
        subject: true,
      },
    });

    const data = classes.map((classItem) => {
      return {
        id: classItem.id,
        name: classItem.name,
        teacher_name: classItem.teacher.fullName,
        subject_name: classItem.subject.name,
      };
    });

    res.status(200).json({
      message: "Classes fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getClassDetail = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;

    const classDetail = await prisma.class.findUnique({
      where: {
        id: classId,
      },
      include: {
        teacher: {
          select: {
            fullName: true,
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!classDetail) {
      res.status(404).json({ message: "Class not found" });
      return;
    }

    const data = {
      id: classDetail.id,
      name: classDetail.name,
      teacherId: classDetail.teacherId,
      subjectId: classDetail.subjectId,
      createdAt: classDetail.createdAt,
      updatedAt: classDetail.updatedAt,
      teaccher_name: classDetail.teacher.fullName,
      subject_name: classDetail.subject.name,
    };

    res.status(200).json({
      message: "Class detail fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching class detail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getStudentForClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;

    const studentsNotInClass = await prisma.student.findMany({
      where: {
        classes: {
          none: {
            classId,
          },
        },
      },
    });

    const studentsInClass = await prisma.classStudent.findMany({
      where: {
        classId,
      },
      include: {
        student: true,
      },
    });

    const studentsInClassData = studentsInClass.map((student) => {
      return { ...student.student };
    });

    res.status(200).json({
      message: "Students fetched successfully",
      studentsNotInClass,
      studentsInClass: studentsInClassData,
    });
  } catch (error) {
    console.error("Error fetching students for class:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addStudentToClass = async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;
    const { students }: { students: string[] } = req.body;

    for (const studentId of students) {
      await prisma.classStudent.create({
        data: {
          classId,
          studentId,
        },
      });
    }

    res.status(200).json({
      message: "Students added to class successfully",
    });
  } catch (error) {
    console.error("Error adding students to class:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteSudentFromClass = async (req: Request, res: Response) => {
  try {
    const { classId, studentId } = req.params;

    await prisma.classStudent.deleteMany({
      where: {
        classId,
        studentId,
      },
    });

    res.status(200).json({
      message: "Student removed from class successfully",
    });
  } catch (error) {
    console.error("Error removing student from class:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const teacherGetClass = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.params;

    const classes = await prisma.class.findMany({
      where: {
        teacherId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      message: "Classes fetched successfully",
      data: classes,
    });
  } catch (error) {
    console.error("Error fetching classes for teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const teacherGetClassDetail = async (req: Request, res: Response) => {
  try {
    const { teacherId, classId } = req.params;

    const classDetail = await prisma.class.findFirst({
      where: {
        id: classId,
        teacherId,
      },
      include: {
        lessons: true,
        exams: true,
        students: {
          include: {
            student: true,
          },
        },
        subject: true,
      },
    });

    if (!classDetail) {
      res.status(404).json({ message: "Class not found" });
      return;
    }

    const data = {
      id: classDetail.id,
      name: classDetail.name,
      lessons: classDetail.lessons,
      exams: classDetail.exams,
      students: classDetail.students.map((student) => student.student),
      subject: classDetail.subject,
    };

    res.status(200).json({
      message: "Class detail fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching class detail for teacher:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
