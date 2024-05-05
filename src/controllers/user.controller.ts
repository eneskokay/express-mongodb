import { NextFunction, Request, Response } from "express";
import mongoose, { Error } from "mongoose";

const User = mongoose.model("user");

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, password } = req.body;
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
  });
  const result = await newUser.save();
  res.status(201).json(result);
};
