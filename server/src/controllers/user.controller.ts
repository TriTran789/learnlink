import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";

const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).send({ success: false, message: "User already exists" });
      return;
    }
    const newUser = await User.create({
      email,
      password: bcrypt.hashSync(
        password,
        bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS) || 10)
      ),
      role,
    });
    if (newUser) {
      res
        .status(201)
        .json({ sucess: true, data: { message: "User created successfully" } });
      return;
    }
    res.status(400).json({
      sucess: false,
      data: { message: "User created unsuccessfully" },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

export default {
  createUser,
};
