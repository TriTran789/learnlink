import { Request, Response } from "express";
import Teacher from "../models/teacher.model";
import User from "../models/user.model";

const createTeacher = async (req: Request, res: Response) => {
  try {
    const { email, fullName, phone, level } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({
        success: false,
        message: "Email already exists",
      });
      return;
    }

    const newTeacher = await Teacher.create({ fullName, phone, level });
    if (!newTeacher) {
      res.status(400).json({
        success: false,
        message: "Teacher creation failed",
      });
      return;
    }
    const newUser = await User.create({
      email,
      password: "zxcvbnm37",
      role: "teacher",
      profileId: newTeacher._id,
    });

    if (!newUser) {
      res.status(400).json({
        success: false,
        message: "User creation failed",
      });
      return;
    }
    // Send email to the teacher with the default password
    // await sendEmail({
    //   to: email,
    //   subject: "Welcome to the platform",
    //   text: `Your account has been created. Your default password is ${process.env.DEFAULT_PASSWORD}.`,
    // });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  createTeacher,
};
