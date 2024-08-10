import { NextFunction, Request, Response } from "express";

export const catchErrors = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return function (req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch((error: any) => {
      console.log("why does this not work?");
      res.status(400).json({ message: error.message });
    });
  };
};
