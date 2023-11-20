import { movieModel, validateMovie } from "../models/movie.js";
import { genreModel } from "../models/genre.js";

const addMovie = async (req, res) => {
    const { title, reviews, ticketprice } = req.body;

    // Validate movie data
    const { error } = validateMovie(req.body);
    if (error) {
        return res.status(400).send({ message: "Movie Data is not Validated", error: error });
    }
    try {
        var genreCategory = req.body.genre.category
        var existingGenre = await genreModel.findOne({ category: genreCategory })
        if (!existingGenre) {
            existingGenre = new genreModel({
                category: genreCategory,
                ratings: req.body.genre.ratings
            })
        }
        existingGenre = await existingGenre.save();
        // Create and save Genre
        let movie = new movieModel({
            title: title,
            genre: existingGenre,
            reviews: reviews,
            ticketprice: ticketprice
        });
        movie = await movie.save();

        res.send(movie);
    } catch (error) {
        res.status(400).send({ message: "Failed to Load Data", error: error.message });
    }
};

export { addMovie }