import { connect } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbUrl= process.env.DB_URL;

connect(dbUrl);

export default {};
