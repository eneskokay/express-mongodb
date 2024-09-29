import OpenAI from "openai";
import { NextFunction, Request, Response } from "express";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getPromtResult = async (req: Request, res: Response) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo",
  });

  return res.status(200).json({ result: completion.choices[0] });
};
