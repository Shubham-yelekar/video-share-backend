import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

export const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`Mongo DB connected , Db host`);
  } catch (error) {
    console.log(`Mongodb Connection Error`, error);
    process.exit(1);
  }
};
