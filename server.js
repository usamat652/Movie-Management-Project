import express from "express";
import customerRouter from "./src/routes/customer.js"
import userRouter from "./src/routes/user.js";
import genreRouter from "./src/routes/genre.js";
import "./src/config/connectDb.js";
import movieRouter from "./src/routes/movie.js";
import { verification } from "./src/controllers/userController.js";
import taskRouter from "./src/routes/task.js";

const port= process.env.PORT;
const app= express();
app.use (express.json());

app.use('/movie/customer', customerRouter);
app.use('/movie/user', userRouter);
app.use('/movie/admin', taskRouter);
app.use('/movie/genre', genreRouter);
app.use('/movie', movieRouter);
app.get("/your-verification-link/:token", verification);
app.use('/movie/user', taskRouter);


app.listen(port, () => {
    console.log("Server Listening on Port:", port)
}); 
