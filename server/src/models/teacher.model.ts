import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["master", "doctor", "professor"],
    },
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;