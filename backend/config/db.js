import { ENV } from "./env.js";
import mongoose from "mongoose";

export const initDB = async () => {
  try {
    await mongoose.connect(ENV.DATABASE_URL);
    console.log("Database intialised successfully..");
  } catch (error) {
    console.log(error);
    console.log("Error connecting to Database");

    process.exit(1);
  }
};
