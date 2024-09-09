import { NextFunction, Response } from "express";
import * as yup from "yup";

const validationMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction,
  validationSchema: yup.ObjectSchema<any>
) => {
  try {
    await validationSchema.validate(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export default validationMiddleware;
