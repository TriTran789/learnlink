import { NextFunction, Request, Response } from "express";
import { TokenExpiredError, verify } from "jsonwebtoken";
import { IRole, JWTPayload } from "../types";

const authorize = (role: IRole | IRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      const accessToken = authHeader?.split(" ")[1];

      if (!accessToken) {
        res.status(401).json({
          success: false,
          message: "No token provided",
        });
        return;
      }

      const decoded = verify(
        accessToken,
        process.env.JWT_SECRET as string
      ) as JWTPayload;

      if (!decoded) {
        res.status(401).json({
          success: false,
          message: "Invalid token",
        });
        return;
      }

      if (!role.includes(decoded.role) || (Array.isArray(role) && !role.includes(decoded.role))) {
        res.status(403).json({
          success: false,
          message: "Forbidden",
        });
        return;
      }

      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        res.status(401).json({
          success: false,
          message: "Token expired",
        });
        return;
      }
      res.status(401).json({
        success: false,
        message: "Invalid authentication",
      });
    }
  };
};

export default authorize;
