import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.DATABASE_URL);

const DbConnection = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};



export default DbConnection;