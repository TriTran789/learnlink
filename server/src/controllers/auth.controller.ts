import { Request, Response } from "express";
import prisma from "../prisma";
import { compareSync } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

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
