import express from 'express';
import { addMovie } from '../controllers/movieController.js';
const movieRouter = express.Router();

movieRouter.post('/addmovie',addMovie);
export default movieRouter;