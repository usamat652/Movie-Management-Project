import { userModel, validateUser } from "../models/user.js";
import { connect } from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

async function seedDatabase() {
  try {
    await connect('mongodb://localhost:27017/Movies_DB');
    console.log("db connected");
    const seedData = [
      {
        firstName: "Admin",
        email: "admin@gmail.com",
        password: "admin",
        isAdmin: true,
      },
    ];
    for (const data of seedData) {
      const { error, value } = validateUser(data);
      if (error) {
        console.error("validationError", error.details[0].message);
      } else {
        const user = new userModel(value);
        await user.save();
        console.log("user added successfully!");
      }
    }
    
  } catch (error) {
    console.error("db connection error", error);
  }
}
seedDatabase();