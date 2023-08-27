import mongoose from "mongoose";
import { connectToDatabase } from "@utils/connectDatabase";
import { CommentModel } from "@app/models/Comments";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  await connectToDatabase();
  const jsonBody = await req.json();
  const session = await getServerSession(authOptions);
  const { email: userEmail } = session.user;
  if (!session) {
    return Response.json(false);
  }
  const commentDoc = await CommentModel.create({
    text: jsonBody.comment,
    uploads: jsonBody.uploads,
    userEmail: userEmail,
    feedbackId: jsonBody.feedbackId,
  });

  return Response.json(commentDoc);
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const jsonbody = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(false);
    }
    const { id, text, uploads } = jsonbody;
    
    const updatedCommentDoc = await CommentModel.findOneAndUpdate(
      { userEmail: session.user.email, _id: id },
      { text, uploads }
    );
    return Response.json(updatedCommentDoc)
  } catch (error) {
    console.log(error);
    return Response.json({error})
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    if (url.searchParams.get("feedbackId")) {
      const result = await CommentModel.find({
        feedbackId: url.searchParams.get("feedbackId"),
      }).populate("user");

      return Response.json(result);
    }
    return Response.json(false);
  } catch (error) {
    console.log(error);
  }
}
