import { connectToDatabase } from "@utils/connectDatabase";
import { FeedBackModel } from "@app/models/Feedback";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const jsonBody = await request.json();
    const { title, description, uploads } = jsonBody;
    await connectToDatabase();
    const session = await getServerSession(authOptions)
    const userEmail = session.user.email
    await FeedBackModel.create({
      title,
      description,
      images: uploads,
      userEmail,
    });
    return Response.json(jsonBody, { status: 201 });
  } catch (error) {
    console.log(error.message);
    return new Response("Failed to get create post", { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();
    return Response.json(await FeedBackModel.find());
  } catch (error) {
    console.log(error.message);
    return Response.json({error: error.message})
  }
}
