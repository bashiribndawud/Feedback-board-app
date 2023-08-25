import { Schema, model, models } from "mongoose";
import "./User"
const feedbackSchema = new Schema(
  {
    title: { type: String, required: [true, "Title is required"] },
    description: { type: String, required: [true, "Description is required"] },
    userEmail: {type: String, require: true},
    images: { type: [String] },
  },
  { timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true} }
);

feedbackSchema.virtual("user", {
  ref: "User",
  localField: "userEmail",
  foreignField: "email",
  justOne: true,
});

export const FeedBackModel =
  models?.FeedBack || model("FeedBack", feedbackSchema);
