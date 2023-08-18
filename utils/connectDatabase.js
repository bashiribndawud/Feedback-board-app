import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if(isConnected){
        console.log('Connection is alrady established...')
        return
    }

    try {
        await mongoose.connect(process.env.MONGO_URL, {
          dbName: "feedback_app",
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('MongoDB is Connected')
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}