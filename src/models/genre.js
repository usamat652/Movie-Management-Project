import Joi from "joi";
import mongoose from "mongoose";

const genreSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    ratings: {
        type: Number,
        required: true,
        minlength: 1,
        maxlength: 5
    }
});

const genreModel = mongoose.model('genre', genreSchema);

function validateGenre(genre) {
    const schema = Joi.object({
        category: Joi.string().required().min(5).max(50),
        ratings: Joi.number().required().min(1).max(5),
    });
    return schema.validate(genre)
}

export {
    genreSchema,
    genreModel,
    validateGenre
}