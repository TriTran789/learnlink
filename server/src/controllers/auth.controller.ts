import { Request, Response } from "express";
import prisma from "../prisma";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { JWTPayload } from "../types";
import { base64ToImageAsync, loadImageFromCloudinary } from "../utils";
import { getFaceDescriptor } from "../utils/face";
import * as faceapi from "face-api.js";

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatchedPassword = compareSync(password, user?.password as string);

    if (!isMatchedPassword) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.cookie(
      "refreshToken",
      sign(
        {
          id: user.id,
          role: user.role,
          profileId: user.studentId || user.teacherId || "ADMIN",
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "7d",
        }
      ),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      }
    );

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      accessToken: sign(
        {
          id: user.id,
          role: user.role,
          profileId: user.studentId || user.teacherId || "ADMIN",
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" }
      ),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "development" ? "strict" : "none",
    });

    res
      .status(200)
      .json({ success: true, message: "User signed out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const decode = verify(refreshToken, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
      profileId: "ADMIN" | "STUDENT" | "TEACHER";
    };

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: sign(
        {
          id: decode.id,
          role: decode.role,
          profileId: decode.profileId,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "15m" }
      ),
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.name === "TokenExpiredError") {
      res.status(401).json({ success: false, message: "Token expired" });
      return;
    }

    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export const checkFace = async (req: Request, res: Response) => {
  try {
    const { image } = req.body;
    const { profileId } = req.user as JWTPayload;

    const student = await prisma.student.findUnique({
      where: {
        id: profileId,
      },
      select: {
        imageUrl: true,
      },
    });

    if (!student) {
      res.status(404).json({
        success: false,
        message: "Student not found",
      });
      return;
    }

    // Load images
    const [image1, image2] = await Promise.all([
      base64ToImageAsync(image),
      loadImageFromCloudinary(student.imageUrl as string),
    ]);

    // Extract face descriptors
    const [descriptor1, descriptor2] = await Promise.all([
      getFaceDescriptor(image1),
      getFaceDescriptor(image2),
    ]);

    // Tính khoảng cách Euclidean
    const distance = faceapi.euclideanDistance(descriptor1, descriptor2);

    if (distance > 0.5) {
      // Threshold for face matching
      res.status(400).json({
        success: false,
        message: "Face check failed",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Face check successful",
      data: distance, // Placeholder for actual face matching logic
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { old_password, new_password } = req.body;
    const { id } = req.user as JWTPayload;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const isMatchedPassword = compareSync(old_password, user.password);

    if (!isMatchedPassword) {
      res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
      return;
    }

    const hashedPassword = await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hashSync(new_password, genSaltSync(10)), // Assume hashing is done in the Prisma model
      },
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
