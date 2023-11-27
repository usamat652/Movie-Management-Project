import express from "express";
import { addGenre } from "../controllers/genreController.js";

const genreRouter= express.Router();

genreRouter.post("/add-genre", addGenre);
// genreRouter.post("/update-customer/:id",updateCustomer);

export default genreRouter;