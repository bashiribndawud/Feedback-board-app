import { connectToDatabase } from "@utils/connectDatabase";
import { FeedBackModel } from "@app/models/Feedback";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    await connectToDatabase();
    const jsonBody = await request.json();
    const { title, description, uploads } = jsonBody;
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
      const sortParam = url.searchParams.get("sort");
      const loadedRows = url.searchParams.get("loadedRows");
      const searchPhrase = url.searchParams.get("search");
      let sortDefinition;
      if (sortParam === "latest") {
        sortDefinition = { createdAt: -1 };
      }
      if (sortParam === "oldest") {
        sortDefinition = { createdAt: 1 };
      }
      if (sortParam === "votes") {
        sortDefinition = { votesCountCached: -1 };
      }
      
      let filter = null;
      if (searchPhrase) {
        filter = {
          $or: [
            { title: { $regex: ".*" + searchPhrase + ".*" } },
            { description: { $regex: ".*" + searchPhrase + ".*" } },
          ],
        };
      } else {
        filter = null;
      }

      return Response.json(
        await FeedBackModel.find(filter, null, {
          sort: sortDefinition,
          skip: loadedRows,
          limit: 5,
        }).populate("user")
      );
    }
  } catch (error) {
    console.log(error.message);
    return Response.json({ error: error.message });
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();
    const jsonBody = await request.json();
    const { title, description, images, id } = jsonBody;
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json(false);
    }
    const newFeedBackDoc = await FeedBackModel.updateOne(
      { _id: id, userEmail: session.user.email },
      { title, description, images }
    );

    return Response.json(newFeedBackDoc);
  } catch (error) {}
}
