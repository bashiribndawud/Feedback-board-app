import mongoose, { Schema, model, models } from "mongoose";
import { User } from "./User";

const CommentSchema = new Schema(
  {
    text: { type: String },
    uploads: { type: [String] },
    userEmail: { type: String, required: true },
    feedbackId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

CommentSchema.virtual("user", {
  ref: 'User',
  localField: "userEmail",
  foreignField: "email",
  justOne: true
});

export const CommentModel = models?.Comment || model("Comment", CommentSchema);
