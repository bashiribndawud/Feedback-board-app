import {connectToDatabase} from "@utils/connectDatabase";
import { FeedBackModel } from "@app/models/Feedback";

export async function POST(request){
    try {
        const jsonBody = await request.json();
        const { title, description } = jsonBody;
        await connectToDatabase();
        await FeedBackModel.create({
          title,
          description,
        });
        return Response.json(jsonBody, { status: 201 });
    } catch (error) {
        console.log(error.message);
        return new Response("Failed to get create post", { status: 500 });
    }
}

