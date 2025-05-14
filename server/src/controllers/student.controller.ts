import { Request, Response } from "express";
import {
  cleanupTempFile,
  generateHTML,
  generateRandomString,
  saveBase64AsFile,
} from "../utils";
import { loadImage } from "canvas";
import * as faceapi from "face-api.js";
import prisma from "../prisma";
import { v2 as cloudinary } from "cloudinary";
import { genSaltSync, hashSync } from "bcryptjs";
import sendMail from "../utils/sendMail";

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { fullName, phone, email, image } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email already in use",
      });
      return;
    }

    // Lưu ảnh base64 tạm thời vào file system
    const tempFilePath = await saveBase64AsFile(image);

    // Tải hình ảnh bằng canvas để phát hiện khuôn mặt
    const img = await loadImage(tempFilePath);

    // Phát hiện khuôn mặt trong hình ảnh
    const detections = await faceapi.detectSingleFace(img as any);

    // Xóa file tạm
    cleanupTempFile(tempFilePath);

    // Nếu không tìm thấy khuôn mặt hoặc điểm số thấp hơn ngưỡng (0.9)
    if (!detections || detections.score < 0.9) {
      res.status(400).json({
        success: false,
        message: "Please select a clearer photo of your face",
      });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: "learnlink",
    });

    const student = await prisma.student.create({
      data: {
        fullName,
        phone,
        imageUrl: result.secure_url,
        publicId: result.public_id,
      },
    });

    const password = generateRandomString();

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashSync(password, genSaltSync(10)),
        role: "STUDENT",
        studentId: student.id,
      },
    });

    await sendMail(email, generateHTML("Student", password));

    res.status(200).json({
      message: "Student created successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
