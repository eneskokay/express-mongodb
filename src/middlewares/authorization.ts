import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const User = mongoose.model("user");

const isAuthorized = async (req: any, res: Response, next: NextFunction) => {
  try {
    const decoded = jwt.verify(
      req.header("authorization").split(" ")[1],
      process.env.JWT_SECRET as string
    ) as { userId: string };

    const user = await User.findOne({ _id: decoded.userId });

    req.userId = decoded.userId;
    req.priced = user.priced;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export { isAuthorized };
