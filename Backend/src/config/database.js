import mongoose from "mongoose";
import "dotenv/config";

/**
 * @description made connection with mongosb atlas
 */
const connectToDB = async () => {
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not configured");
  }
  await mongoose.connect(process.env.MONGO_URL);
};

export default connectToDB;
