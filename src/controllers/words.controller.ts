import mongoose from "mongoose";
import { NextFunction, Response, Request } from "express";
import { IAuthorizedRequest } from "../lib/types/commonTypes";

const WordModel = mongoose.model("Word");
const UserWordActivityModel = mongoose.model("UserWordActivity");
const CollectionModel = mongoose.model("Collection");
const UserModel = mongoose.model("User");

export const getWordsPartially = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { specificRange, category } = req.body;
  const user = await UserModel.findOne({ _id: req.userId });

  let words;
  if (specificRange) {
    words = await WordModel.find({}, null, {
      skip: specificRange.skip,
      limit: specificRange.limit,
    });
  } else {
    words = await WordModel.find();
  }

  res.status(200).json(words);
};

export const getAllCollections = async (
  req: IAuthorizedRequest,
  res: Response
) => {
  const collections = await UserWordActivityModel.aggregate([
    { $match: { userId: req.userId } }, // Match the user by userId
    {
      $project: {
        _id: 0,
        collections: {
          $map: {
            input: "$collections",
            as: "collection",
            in: {
              // Project all properties except learntWordIds
              collectionId: "$$collection.collectionId", // Include _id or other needed fields
              collectionName: "$$collection.collectionName", // Include other fields as needed
              // Add other fields here that you want to keep
            },
          },
        },
      },
    },
  ]);

  if (!collections) {
    res.status(404).json({ message: "Collection Not Found" });
  } else {
    res.status(200).json({ collections: collections[0].collections });
  }
};

export const createCollection = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { collectionName } = req.body;
  const newCollection = new CollectionModel({ collectionName: collectionName });

  await UserWordActivityModel.findOneAndUpdate(
    {
      userId: req.userId,
    },
    {
      $addToSet: {
        collections: newCollection,
      },
    }
  );

  res.status(200).json({ message: "Collection created successfully" });
};

export const deleteCollection = async (
  req: IAuthorizedRequest,
  res: Response
) => {
  const { collectionId } = req.body;

  const result = await UserWordActivityModel.findOneAndUpdate(
    {
      userId: req.userId,
      "collections.collectionId": collectionId, // Ensure the collectionId exists
    },
    {
      $pull: { collections: { collectionId } },
    },
    {
      new: true,
      upsert: false,
    }
  );

  if (!result) {
    res.status(400).json({ message: "Collection not found'" });
  } else {
    res.status(200).json({ message: "Collection deleted successfully" });
  }
};

export const addWordToCollection = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { wordId, collectionId } = req.body;

  const wordActivities = await UserWordActivityModel.findOneAndUpdate(
    {
      userId: req.userId,
      "collections.collectionId": collectionId,
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
  const { wordId, collectionId } = req.body;

  const wordActivities = await UserWordActivityModel.findOneAndUpdate(
    {
      userId: req.userId,
      "collections.collectionId": collectionId,
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
