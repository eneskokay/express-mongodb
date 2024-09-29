import { Request } from "express";

interface IAuthorizedRequest extends Request {
  userId: string;
}

export { IAuthorizedRequest };
