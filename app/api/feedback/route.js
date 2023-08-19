import { connectToDatabase } from "@utils/connectDatabase";
import { FeedBackModel } from "@app/models/Feedback";

export async function POST(request) {
  try {
    const jsonBody = await request.json();
    const { title, description, uploads } = jsonBody;
    await connectToDatabase();
    await FeedBackModel.create({
      title,
      description,
      images: uploads,
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
