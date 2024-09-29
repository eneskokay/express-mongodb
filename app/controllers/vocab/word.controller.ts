import mongoose from "mongoose";
import { NextFunction, Response, Request } from "express";

const WordModel = mongoose.model("Word");

export const getWordsPartially = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { skip, limit } = req.query;

  let words;
  if (skip && limit && !isNaN(skip) && !isNaN(limit)) {
    words = await WordModel.find({}, null, {
      skip: skip,
      limit: limit,
    });
  } else {
    words = await WordModel.find();
  }

  return res.status(200).json(words);
};
