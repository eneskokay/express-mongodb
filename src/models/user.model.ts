import { log } from "console";
import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true, // supposed to be checked ot if it is unique
    },
    password: {
      type: String,
      required: true,
      min: 8,
      validate: {
        validator: (password: string) => {
          const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

          console.log("regex", regex);
          console.log("regex.test(password)", regex.test(password));
          console.log("password", password);

          return regex.test(password);
        },
        message:
          "Password must be at least 8 characters long and contain at least one lowercase, one uppercase, one number.",
      },
    },
    active: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: true,
    },
    userDetails: {
      nativeLanguage: {
        type: String,
        required: true,
      },
      englishLevel: {
        type: String,
        enum: ["LVL_BEGINNER", "LVL_INTERMEDIATE", "LVL_ADVANCED"],
        required: true,
      },
      interestedTopics: {
        type: [
          "TPC_BUSINESS",
          "TPC_SCIENCE",
          "TPC_TECHNOLOGY",
          "TPC_ARTS",
          "TPC_SPORTS",
        ],
        required: true,
      },
    },
  },
  { timestamps: true }
);

userSchema.method("isValidPassword", (password: string) => {});

export default mongoose.model("user", userSchema);
