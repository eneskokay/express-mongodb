import mongoose from "mongoose";
import { IAuthorizedRequest } from "../../lib/types/commonTypes";
import { NextFunction, Response, Request } from "express";

const UserModel = mongoose.model("User");
const CategoryModel = mongoose.model("Category");
const WordModel = mongoose.model("Word");

export const getAllCategories = async (
  req: IAuthorizedRequest,
  res: Response
) => {
  const categories = await UserModel.findOne({ _id: req.userId })
    .populate({
      path: "categories",
      populate: {
        path: "words",
      },
    })
    .then((user) => user.categories);

  if (!categories) {
    return res
      .status(404)
      .json({ message: "An error occurred while fetching categories" });
  } else {
    return res.status(200).json({ categories: categories });
  }
};

export const createCategory = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { categoryName } = req.body;
  const newCategory = new CategoryModel({
    categoryName: categoryName,
    words: [],
  });
  const saveResult = await newCategory.save();

  if (!saveResult) {
    return res.status(400).json({ message: "Category could not be created" });
  }

  await UserModel.findOneAndUpdate(
    {
      _id: req.userId,
    },
    {
      $addToSet: {
        categories: newCategory,
      },
    }
  );

  return res.status(200).json({
    message: "Category created successfully",
    categoryId: newCategory._id,
  });
};

export const deleteCategory = async (
  req: IAuthorizedRequest,
  res: Response
) => {
  const { categoryId } = req.body;

  const deleteFromCategoryModel = await CategoryModel.findOneAndDelete({
    _id: categoryId,
  });

  const deleteFromUserModel = await UserModel.findOneAndUpdate(
    {
      _id: req.userId,
    },
    {
      $pullAll: { categories: [categoryId] },
    }
  );

  if (!deleteFromCategoryModel || !deleteFromUserModel) {
    return res.status(400).json({ message: "Category not found'" });
  } else {
    return res.status(200).json({ message: "Category deleted successfully" });
  }
};

export const addWordToCategory = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { wordId, categoryId } = req.body;
  const word = await WordModel.findById(wordId).catch((err) => {
    return res.status(404).json({ message: "Word Not Found" });
  });
  const category = await CategoryModel.findOneAndUpdate(
    {
      _id: categoryId,
    },
    {
      $addToSet: { words: word },
    }
  );

  if (!category) {
    return res.status(404).json({ message: "Category Not Found" });
  } else {
    res
      .status(200)
      .json({ message: "Word added to the category successfully" });
  }
};

export const removeWordFromCategory = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { wordId, categoryId } = req.body;
  const wordActivities = await CategoryModel.findOneAndUpdate(
    {
      _id: categoryId,
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
    return res.status(404).json({ message: "Category Not Found" });
  } else {
    res
      .status(200)
      .json({ message: "Word removed from the category successfully" });
  }
};
