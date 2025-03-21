import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import mongoose from "mongoose";
import userRoute from "./routes/user.route";
import authRoute from "./routes/auth.route";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://learnlink-beige.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health Ok!" });
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

app.listen(7000, () => {
  console.log("Server is running on port 7000");
});
