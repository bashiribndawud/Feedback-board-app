import { connectToDatabase } from "@utils/connectDatabase";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Vote } from "@app/models/Vote";

export async function POST(request) {
  await connectToDatabase();
  const { feedbackId } = await request.json();
  const session = await getServerSession(authOptions);
  const { email: userEmail } = session.user;

  //   find existing vote;
  const existingVote = await Vote.findOne({ feedbackId, user: userEmail });

  if (existingVote) {
    await Vote.findByIdAndDelete(existingVote._id);
    return Response.json("Feedback Deleted");
  } else {
    const voteDoc = await Vote.create({
      user: userEmail,
      feedbackId,
    });
    return Response.json(voteDoc);
  }
}

export async function GET(request) {
  await connectToDatabase();
  const url = new URL(request.url);
  if (url.searchParams.get("feedbackIds")) {
    const feedbackIds = url.searchParams.get("feedbackIds").split(",");
    const voteDocs = await Vote.find({ feedbackId: feedbackIds });
    console.log(voteDocs);
    return Response.json(voteDocs);
  } 
  return Response.json([]);

}
