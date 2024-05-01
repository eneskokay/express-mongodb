import { Request, Response } from "express";

export const createNewUser = async (req: Request, res: Response) => {
  try {
    console.log(req, res);
  } catch (error) {
    console.log(error);
  }
};
