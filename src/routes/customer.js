import express from 'express';
import { addCustomer } from '../controllers/customerController.js';
const customerRouter = express.Router();

customerRouter.post('/addcustomer',addCustomer)

export default customerRouter;