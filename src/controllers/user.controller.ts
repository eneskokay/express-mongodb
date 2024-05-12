import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import { sendCode } from "../emailTemplates/emailVerification";

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
  const verificationCode = Math.random().toString(36).substring(7).toString();

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
    from: `verification@vocabzy.ai`,
    to: email,
    subject: "Verify your email address",
    text: `Your verification code is ${verificationCode}`,
    html: sendCode({
      code: verificationCode,
      title: `${firstName} ${lastName}`,
      subtitle: "Account Activation",
      text: `Please verify your e-mail address using the verification code. The verification code is valid for only 10 minutes.`,
      footer:
        "All rights reserved. © 2024 Vocabzy.ai. Unauthorized duplication, reproduction, or distribution in any form, whether in part or in whole, is strictly prohibited and may result in legal action.",
    }),
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
