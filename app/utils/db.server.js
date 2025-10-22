// app/utils/db.server.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // load .env variables

let conn = null;

async function connectDB() {
  if (conn) return conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI must be set in .env");

  try {
    conn = await mongoose.connect(uri, {
      // Mongoose options
      useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5s timeout
    });

    mongoose.connection.on("error", err => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected! Attempting reconnect...");
      conn = null; // reset connection so next call reconnects
      connectDB().catch(err => console.error("Reconnect failed:", err));
    });

    console.log("MongoDB connected successfully!");
    return conn;
  } catch (err) {
    console.error("MongoDB initial connection error:", err);
    throw err;
  }
}

export default mongoose;
export { connectDB };
