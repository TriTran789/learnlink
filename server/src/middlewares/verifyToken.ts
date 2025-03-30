import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: "root" | "teacher" | "student";
  iat?: number;
  exp?: number;
}

interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access denied",
    });
    return;
  }

  try {
    const decode = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as TokenPayload;

    req.user = decode;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Access token expired",
      });
      return;
    }

    res.status(403).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }
};
