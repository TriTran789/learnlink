export type IRole = "ADMIN" | "TEACHER" | "STUDENT";

export type JWTPayload = {
  id: string;
  role: IRole;
  profileId: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}