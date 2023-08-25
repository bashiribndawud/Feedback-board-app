import { connectToDatabase } from "@utils/connectDatabase";
import { FeedBackModel } from "@app/models/Feedback";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const jsonBody = await request.json();
    const { title, description, uploads } = jsonBody;
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    const userEmail = session.user.email;
    const feedbackDoc = await FeedBackModel.create({
      title,
      description,
      images: uploads,
      userEmail,
    });
    return Response.json(feedbackDoc, { status: 201 });
  } catch (error) {
    console.log(error.message);
    return new Response("Failed to get create post", { status: 500 });
  }
}

export async function GET(req) {
  await connectToDatabase();
  try {
    const url = new URL(req.url);
    if (url.searchParams.get("id")) {
      return Response.json(
        await FeedBackModel.findById(url.searchParams.get("id"))
      );
    } else {
      return Response.json(await FeedBackModel.find().populate("user"));
    }
  } catch (error) {
    console.log(error.message);
    return Response.json({ error: error.message });
  }
}

export async function PUT(request) {
  const jsonBody = await request.json();
  const { title, description, images, id } = jsonBody;
  await connectToDatabase();
  const session = await getServerSession(authOptions);
  if(!session){
    return Response.json(false)
  }
  const newFeedBackDoc = await FeedBackModel.updateOne(
    { _id: id, userEmail: session.user.email },
    { title, description, images },
  );

 return Response.json(newFeedBackDoc);
}
