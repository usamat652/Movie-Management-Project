import Joi from "joi";
import { Schema, model } from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 225
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 225,
    },
    email: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    isAdmin: {
        type: Boolean,
    },
    rememberToken: {
        type: String,
    }
});

// const jwt_key = process.env.SECRET_KEY;
// userSchema.methods.generateAuthToken = () => {
//     const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, jwt_key)
//     return token
// }
const userModel = model('user', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(255).required(),
        lastName: Joi.string().min(3).max(255),
        email: Joi.string().min(10).max(50).required().email(),
        password: Joi.string().min(5).max(100).required(),
        isAdmin: Joi.boolean()
    });
    return schema.validate(user)
}
export { userModel, validateUser };