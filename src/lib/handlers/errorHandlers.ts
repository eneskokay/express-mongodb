import { NextFunction, Request, Response } from "express";

export const catchErrors = (
  fn: (req: any, res: any, next: NextFunction) => Promise<void>
) => {
  return function (req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch((error: any) => {
      res.status(400).json({ message: error.message });
    });
  };
};
