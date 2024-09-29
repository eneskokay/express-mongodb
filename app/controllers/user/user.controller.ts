import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { sendCode } from "../../lib/emailTemplates/emailVerification";
import jwt from "jsonwebtoken";
import Mailjet from "node-mailjet";

const User = mongoose.model("User");

const mailClient = new Mailjet.Client({
  apiKey: process.env.SMTP_USER,
  apiSecret: process.env.SMTP_PASS,
});

export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, email } = req.body;

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  const newUser = new User({
    firstName,
    lastName,
    email,
    active: false,
    verificationCode: verificationCode,
    verificationCodeUpdatedAt: new Date(),
    priced: false,
  });
  const existUser = await User.findOne({ email });

  if (!!existUser) {
    if (existUser.active) {
      return res.status(400).json({ message: "This email is already used" });
    }
    if (existUser.verificationCodeUpdatedAt > new Date(Date.now() - 600000)) {
      return res.status(400).json({ message: "The code is already sent!" });
    }
    if (!existUser.active) {
      existUser.verificationCode = verificationCode;
      existUser.verificationCodeUpdatedAt = new Date();
      await User.updateOne(
        { email },
        {
          firstName,
          lastName,
          email,
          verificationCode: verificationCode,
          verificationCodeUpdatedAt: new Date(),
        }
      );
    }
  } else {
    await newUser.save();
  }

  mailClient.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: { Email: `verification@vocabzy.ai`, Name: "vocabzy" },
        To: { Email: email, Name: firstName },
        Subject: "Verify your email address",
        TextPart: `Your verification code is ${verificationCode}`,
        HtmlPart: sendCode({
          code: verificationCode,
          title: `${firstName} ${lastName}`,
          subtitle: "Account Activation",
          text: `Please verify your email address using the verification code provided below. The code is valid for only 10 minutes.`,
          footer:
            "All rights reserved. © 2024 Vocabzy.ai. Unauthorized duplication, reproduction, or distribution in any form, whether in part or in whole, is strictly prohibited and may result in legal action.",
        }),
      },
    ],
  });

  return res.status(201).json({
    message:
      "The user has been created successfully, Please verify your email address!",
  });
};

export const loginViaEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json({ message: "There is no user with this email" });
  }

  if (user.verificationCodeUpdatedAt > new Date(Date.now() - 600000)) {
    return res.status(400).json({ message: "The code is already sent!" });
    return undefined;
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  user.verificationCode = verificationCode;
  user.verificationCodeUpdatedAt = new Date();

  await user.save();

  if (user.active) {
    mailClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: `verification@vocabzy.ai`, Name: "vocabzy" },
          To: [{ Email: email, Name: user.firstName }],
          Subject: `Login PIN: ${verificationCode}`,
          TextPart: `Your verification code is ${verificationCode}`,
          HtmlPart: sendCode({
            code: verificationCode,
            title: `${user.firstName} ${user.lastName}`,
            subtitle: "Dear, User",
            text: `Please use the code provided below to login your account. The code is valid for only 10 minutes.`,
            footer:
              "All rights reserved. © 2024 Vocabzy.ai. Unauthorized duplication, reproduction, or distribution in any form, whether in part or in whole, is strictly prohibited and may result in legal action.",
          }),
        },
      ],
    });
  }

  if (!user.active) {
    mailClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: { Email: `verification@vocabzy.ai`, Name: "vocabzy" },
          To: { Email: email, Name: user.firstName },
          Subject: "Verify your email address",
          TextPart: `Your verification code is ${verificationCode}`,
          HtmlPart: sendCode({
            code: verificationCode,
            title: `${user.firstName} ${user.lastName}`,
            subtitle: "Account Activation",
            text: `Please verify your email address using the verification code provided below. The code is valid for only 10 minutes.`,
            footer:
              "All rights reserved. © 2024 Vocabzy.ai. Unauthorized duplication, reproduction, or distribution in any form, whether in part or in whole, is strictly prohibited and may result in legal action.",
          }),
        },
      ],
    });
  }

  return res.status(200).json({
    message: "The verification code has been sent to the user's email",
    userStatus: user.active ? "active" : "inactive",
  });
};

/**
 * @description can be used in both login and signup processess
 */
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
    return res.status(400).json({ message: "Invalid Information!" });
  }

  if (user.verificationCodeUpdatedAt < new Date(Date.now() - 600000)) {
    return res.status(400).json({ message: "Verification code expired" });
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "30d",
    }
  );

  if (!user.active) {
    // 600000 milliseconds = 10 minutes
    user.active = true;
    await user.save();
    return res.status(200).json({
      message: "The user has been activated and logged in successfully",
      token: token,
    });
  }

  if (user.active) {
    return res
      .status(200)
      .json({ message: "Logged in successfully", token: token });
  }
};

/**
 * @description can be used only in signup processess, not in login
 */
export const resendVerificationCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json("No user found with this email");
  }
  if (
    !user.active &&
    user.verificationCodeUpdatedAt > new Date(Date.now() - 600000)
  ) {
    res
      .status(404)
      .json({ message: "Already sent a verification code to the email" });
  }
  if (!user) {
    return res
      .status(404)
      .json({ message: "There is no user with this email" });
  }
  if (user.active) {
    return res.status(400).json({ message: "The user is already verified" });
  }

  const verificationCode = Math.random().toString(36).substring(7).toString();

  user.verificationCode = verificationCode;
  user.verificationCodeUpdatedAt = new Date();
  await user.save();

  mailClient.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: { Email: `verification@vocabzy.ai`, Name: "vocabzy" },
        To: { Email: email, Name: user.firstName },
        Subject: "Verify your email address",
        TextPart: `Your verification code is ${verificationCode}`,
        HtmlPart: sendCode({
          code: verificationCode,
          title: `${user.firstName} ${user.lastName}`,
          subtitle: "Account Activation",
          text: `Please verify your email address using the verification code provided below. The code is valid for only 10 minutes.`,
          footer:
            "All rights reserved. © 2024 Vocabzy.ai. Unauthorized duplication, reproduction, or distribution in any form, whether in part or in whole, is strictly prohibited and may result in legal action.",
        }),
      },
    ],
  });

  return res.status(201).json({
    message: "The verification code has been sent to the user's email",
  });
};

export const getUserInfos = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  return res.status(200).json({ message: "User infos" });
};
