import mongoose from "mongoose";
import Joi from 'joi';

// Define the customer Schema
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength:225
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength:12
    }
});

const Customer = mongoose.model('Customer', customerSchema);
//validate Customer
//Joi--> a validation library for javaScript used in context of Node js Applications.
function validateCustomer(customer){
    const schema =Joi.object({
        name: Joi.string().min(3).max(225).required(),
        isGold: Joi.boolean().required(),
        phone: Joi.string().min(5).max(12).required()
    });
    return schema.validate(customer);//This returns an object {error,value}
}

export{Customer,validateCustomer};
