import express from "express";
import { signup, signin, addAdmin } from "../controllers/userController.js";
import authenticateUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin)
userRouter.post("/add-admin", addAdmin);
// userRouter.get("/your-verification-link/:token", verification);


export default userRouter;