import Joi from "joi";
import mongoose from "mongoose";
import { genreSchema } from './genre.js'

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 250
    },
    genre:{
        type: genreSchema,
        required: true
    },
    reviews: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 50
    },
    ticketprice: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 10
    }
});

const movieModel = mongoose.model('movie', movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().required().min(5).max(50),
        genre: Joi.object({
            category: Joi.string().required().min(5).max(50),
            ratings: Joi.number().required().min(1).max(5)
        }).required(),
        reviews: Joi.string().required().min(5).max(50),
        ticketprice: Joi.number().required().min(2).max(10),
    });
    return schema.validate(movie)
}
export {
    movieModel,
    validateMovie
}