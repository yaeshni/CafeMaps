import mongoose from "mongoose";

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 * Exits the process if the connection fails, since the app can't
 * meaningfully run without a database connection for the favorites feature.
 */
export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}
