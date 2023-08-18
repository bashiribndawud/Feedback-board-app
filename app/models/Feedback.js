import { Schema, model, models } from "mongoose";

const feedbackSchema = new Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String, required: [true, "Description is required"] },
  },
  { timestamps: true }
);


export const FeedBackModel = models?.FeedBack || model("FeedBack", feedbackSchema);

