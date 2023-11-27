import mongoose  from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbUrl= process.env.DB_URL;

mongoose.connect(dbUrl);

export default {};
