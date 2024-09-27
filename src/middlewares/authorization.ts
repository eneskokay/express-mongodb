import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const User = mongoose.model("User");

const isAuthorized = async (req: any, res: Response, next: NextFunction) => {
  try {
    const decodedToken = jwt.verify(
      req.header("authorization").split(" ")[1],
      process.env.JWT_SECRET as string
    ) as { userId: string };

    const user = await User.findOne({ _id: decodedToken.userId });

    req.userId = decodedToken.userId;
    req.priced = user.priced;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export { isAuthorized };
