import express from "express";
import authRoute from "./routes/auth.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import teacherRoute from "./routes/teacher.route";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import studentRoute from "./routes/student.route";
import "@tensorflow/tfjs-node";
import * as canvas from "canvas";
import * as faceapi from "face-api.js";
import path from "path";
import subjectRoute from "./routes/subject.route";
import classRoute from "./routes/class.route";
import lessonRoute from "./routes/lesson.route";
import examRoute from "./routes/exam.route";
import questionRoute from "./routes/question.route";

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình canvas cho face-api
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({
  Canvas: Canvas as any,
  Image: Image as any,
  ImageData: ImageData as any,
});

const loadModels = async () => {
  const MODELS_PATH = path.join(__dirname, "../models");

  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceExpressionNet.loadFromDisk(MODELS_PATH);
    await faceapi.nets.ageGenderNet.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceLandmark68TinyNet.loadFromDisk(MODELS_PATH);
    await faceapi.nets.tinyFaceDetector.loadFromDisk(MODELS_PATH);
    console.log("Đã tải xong models face-api.js");
  } catch (error) {
    console.error("Lỗi khi tải models:", error);
  }
};

loadModels();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    // origin: "http://localhost:5173",
    // origin: "https://learnlink-kma.vercel.app",
    origin: process.env.ORIGIN_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy" });
});

app.use("/api/v1", authRoute);
app.use("/api/v1", teacherRoute);
app.use("/api/v1", studentRoute);
app.use("/api/v1", subjectRoute);
app.use("/api/v1", classRoute);
app.use("/api/v1", lessonRoute);
app.use("/api/v1", examRoute);
app.use("/api/v1", questionRoute);

app.listen(7000, () => {
  console.log("Server is running on port 7000");
});
