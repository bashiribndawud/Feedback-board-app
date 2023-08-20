import { connectToDatabase } from "@utils/connectDatabase";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { Vote } from "@app/models/Vote";

export async function POST(request) {
  await connectToDatabase();
  const { feedbackId } = await request.json();
  const session = await getServerSession(authOptions);
  const { email: userEmail } = session.user;

  const voteDoc = await Vote.create({
    user: userEmail,
    feedbackId,
  });
  return Response.json(voteDoc);
}
