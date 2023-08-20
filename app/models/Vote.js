import mongoose, { Schema, model, models } from "mongoose";

const VoteSchema = new Schema(
  {
    user: { type: "string", required: true },
    feedbackId: { type: mongoose.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

export const Vote = models?.Vote || model("Vote", VoteSchema);
