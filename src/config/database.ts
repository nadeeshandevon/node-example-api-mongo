import mongoose from "mongoose";
import { MONGO_URI } from "./index";

export const connectDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState === 1) return; // already connected
  await mongoose.connect(MONGO_URI);
};

