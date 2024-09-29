import mongoose from "mongoose";
import { IAuthorizedRequest } from "../../lib/types/commonTypes";
import { NextFunction, Response, Request } from "express";

const UserModel = mongoose.model("User");
const CollectionModel = mongoose.model("Collection");
const WordModel = mongoose.model("Word");

export const getAllCollections = async (
  req: IAuthorizedRequest,
  res: Response
) => {
  const collections = await UserModel.findOne({ _id: req.userId })
    .populate({
      path: "collections",
      populate: {
        path: "words",
      },
    })
    .then((user) => user.collections);

  if (!collections) {
    return res
      .status(404)
      .json({ message: "An error occurred while fetching collections" });
  } else {
    return res.status(200).json({ collections: collections });
  }
};

export const createCollection = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { collectionName } = req.body;
  const newCollection = new CollectionModel({
    collectionName: collectionName,
    words: [],
  });
  const saveResult = await newCollection.save();

  if (!saveResult) {
    return res.status(400).json({ message: "Collection could not be created" });
  }

  await UserModel.findOneAndUpdate(
    {
      _id: req.userId,
    },
    {
      $addToSet: {
        collections: newCollection,
      },
    }
  );

  return res.status(200).json({
    message: "Collection created successfully",
    collectionId: newCollection._id,
  });
};

export const deleteCollection = async (
  req: IAuthorizedRequest,
  res: Response
) => {
  const { collectionId } = req.body;

  const deleteFromCollectionModel = await CollectionModel.findOneAndDelete({
    _id: collectionId,
  });

  const deleteFromUserModel = await UserModel.findOneAndUpdate(
    {
      _id: req.userId,
    },
    {
      $pullAll: { collections: [collectionId] },
    }
  );

  if (!deleteFromCollectionModel || !deleteFromUserModel) {
    return res.status(400).json({ message: "Collection not found'" });
  } else {
    return res.status(200).json({ message: "Collection deleted successfully" });
  }
};

export const addWordToCollection = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { wordId, collectionId } = req.body;
  const word = await WordModel.findById(wordId).catch((err) => {
    return res.status(404).json({ message: "Word Not Found" });
  });
  const collection = await CollectionModel.findOneAndUpdate(
    {
      _id: collectionId,
    },
    {
      $addToSet: { words: word },
    }
  );

  if (!collection) {
    return res.status(404).json({ message: "Collection Not Found" });
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
  const wordActivities = await CollectionModel.findOneAndUpdate(
    {
      _id: collectionId,
    },
    {
      $pull: { words: wordId },
    },
    {
      new: true,
      upsert: false,
    }
  );

  if (!wordActivities) {
    return res.status(404).json({ message: "Collection Not Found" });
  } else {
    res
      .status(200)
      .json({ message: "Word removed from the collection successfully" });
  }
};
