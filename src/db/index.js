import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(" ✅ MongoDB connected", process.env.MONGO_URI);
    } catch (error) {
        console.error(" ❌ MongoDB connection error", error);
        process.exit(1);   //exit if the connection fail
    }
}

export default connectDB;

//Database connection file