import { Request, Response } from "express";
import User from "../models/user.model";
import { generateAccessToken, generateRefreshToken } from "../utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ success: false, message: "User not found" });
      return;
    }
    const isMatchedPassword = bcrypt.compareSync(password, user.password);
    if (!isMatchedPassword) {
      res
        .status(400)
        .json({ success: false, message: "Password is incorrect" });
      return;
    }

    res
      .cookie(
        "refreshToken",
        generateRefreshToken({ id: user._id, role: user.role }),
        {
          httpOnly: true,
          sameSite: "none",
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        }
      )
      .status(200)
      .json({
        success: true,
        data: {
          message: "Sign In Successfully",
          accessToken: generateAccessToken({ id: user._id, role: user.role }),
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal server errorr" });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        data: {
          message: "Logout successfully",
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal server errorr" });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ success: false, message: "Unauthenticated" });
    return;
  }

  try {
    const decoded: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    );
    res.status(200).json({
      success: true,
      accessToken: generateAccessToken({ id: decoded.id, role: decoded.role }),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal server errorr" });
  }
};

export default {
  signIn,
  logout,
  refreshToken,
};
