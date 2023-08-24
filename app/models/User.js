import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,
    email: String,
    image: String,
    emailVerified: Date
  },
  { timestamps: true }
);

export const User = models?.User || model("User", UserSchema);
