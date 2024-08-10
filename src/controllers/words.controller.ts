import mongoose from "mongoose";
import { NextFunction, Response, Request } from "express";
import { IAuthorizedRequest } from "../lib/types/commonTypes";

const wordsModel = mongoose.model("word");
const userModel = mongoose.model("user");
const userWordActivityModel = mongoose.model("userWordActivity");

// TODO: change the name
export const getWordsFromCollection = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { specificRange, category } = req.body;
  const user = await userModel.findOne({ _id: req.userId });

  let words;
  if (specificRange) {
    words = await wordsModel.find({}, null, {
      skip: specificRange.skip,
      limit: specificRange.limit,
    });
  } else {
    words = await wordsModel.find();
  }

  res.status(200).json(words);
};

export const getAllCollections = async (
  req: IAuthorizedRequest,
  res: Response
) => {
  const collections = await userWordActivityModel.find(
    { userId: req.userId },
    { collections: 1 }
  );

  if (!collections) {
    res.status(404).json({ message: "Collections Not Found" });
  } else {
    res.status(200).json(collections);
  }
};

export const createCollection = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { collectionName } = req.body;

  const wordActivities = await userWordActivityModel.findOneAndUpdate(
    {
      userId: req.userId,
    },
    {
      $addToSet: {
        collections: {
          collectionName,
          id: new mongoose.Types.ObjectId(),
        },
      },
    }
  );

  if (!wordActivities) {
    res.status(404).json({ message: "Collection Not Found" });
  } else {
    res.status(200).json({ message: "Word added to collection successfully" });
  }
};

export const addWordToCollection = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { wordId, id } = req.body;

  const wordActivities = await userWordActivityModel.findOneAndUpdate(
    {
      userId: req.userId,
      "collections.id": id,
    },
    {
      $addToSet: { "collections.$.learntWordIDs": wordId },
    },
    {
      new: true,
      upsert: false,
    }
  );

  if (!wordActivities) {
    res.status(404).json({ message: "Collection Not Found" });
  } else {
    res
      .status(200)
      .json({ message: "Word added to the collection successfully" });
  }
};

export const removeWordFromCollection = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { wordId, id } = req.body;

  const wordActivities = await userWordActivityModel.findOneAndUpdate(
    {
      userId: req.userId,
      "collections.id": id,
    },
    {
      $pull: { "collections.$.learntWordIDs": wordId },
    },
    {
      new: true,
      upsert: false,
    }
  );

  if (!wordActivities) {
    res.status(404).json({ message: "Collection Not Found" });
  } else {
    res
      .status(200)
      .json({ message: "Word removed from the collection successfully" });
  }
};
