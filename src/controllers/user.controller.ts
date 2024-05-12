import { log } from "console";
import { NextFunction, Request, Response } from "express";
import mongoose, { Error } from "mongoose";
import nodemailer from "nodemailer";

const User = mongoose.model("user");

// SMTP Connection
const mailTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email, password } = req.body;
  const verificationCode = Math.random().toString(36).substring(7);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    active: false,
    verificationCode: verificationCode,
  });
  const result = await newUser.save();

  mailTransport.sendMail({
    from: `verification@vocabzy.com`,
    to: email,
    subject: "Verify your email address",
    text: `Your verification code is ${verificationCode}`,
    html: `<p>Your verification code is <h3>${verificationCode}</h3></p>`,
  });

  res.status(201).json({
    message: "The verification code has been sent to the user's email",
  });
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).json({ message: "Invalid User Informations" });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, verificationCode } = req.body;
  const user = await User.findOne({
    email,
    verificationCode,
  });
  if (!user) {
    res.status(404).json({ message: "Invalid Information" });
  }
  // 3 minutes = 180000 milliseconds
  if (user.createdAt < new Date(Date.now() - 180000)) {
    res.status(404).json({ message: "Verification code expired" });
  }
  user.active = true;
  await user.save();
  res.status(200).json({ message: "The user has been created successfully" });
};
