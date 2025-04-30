import express from "express";
import authRoute from "./routes/auth.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import teacherRoute from "./routes/teacher.route";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(
  cors({
    // origin: "http://localhost:5173",
    origin: "https://learnlink-kma.vercel.app",
    // origin: process.env.ORIGIN_URL,
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

app.listen(7000, () => {
  console.log("Server is running on port 7000");
});
