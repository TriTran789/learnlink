import jwt from "jsonwebtoken";

export const generateAccessToken = (data: any) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (data: any) => {
  return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};
