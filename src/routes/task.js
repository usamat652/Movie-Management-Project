import express from "express";
import { addTask, deleteTask } from "../controllers/taskController.js";
import isAdminMiddleware  from "../middleware/admin.js";
import authenticateUser from "../middleware/auth.js";

const taskRouter = express.Router();

taskRouter.post('/add-task', authenticateUser, isAdminMiddleware, addTask)
taskRouter.delete('/delete-task/:taskId', authenticateUser, isAdminMiddleware, deleteTask)


export default taskRouter;