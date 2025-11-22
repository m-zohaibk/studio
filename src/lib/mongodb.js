import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGO_URI

console.log("MONGODB_URI", MONGODB_URI);

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local',
    )
}

const connectDB = async () => {

    console.log("dbConnect called");
    if (mongoose.connections[0].readyState) {
        console.log("Already connected to DB");
        return true
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");
        return true;
    } catch (error) {
        console.log("Error connecting to DB", error);
    }
}

export default connectDB