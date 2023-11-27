import { genreModel, validateGenre } from "../models/genre.js";

const addGenre = async (req, res) => {
    const { category, ratings } = req.body;

    // Validate customer data
    const { error } = validateGenre(req.body);
    if (error) {
        return res.status(400).send({ message: "Genre Data is not Validated", error: error });
    }
    try {
        // Create and save Genre
        let genre = new genreModel({
            category: category,
            ratings: ratings
        });
        genre = await genre.save();

        res.send(genre);
    } catch (error) {
        res.status(400).send({ message: "Failed to Load Data", error: error.message });
    }
};

export { addGenre }