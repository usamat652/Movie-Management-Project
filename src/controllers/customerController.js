import {Customer,validateCustomer} from '../models/customer.js';

async function addCustomer(req,res){

    const {error} = validateCustomer(req.body);
    if(error){
        res.status(400).send({message:'Customer data not validated',error:error});
    }
    let newCustomer = new Customer({
        name : req.body.name,
        isGold:req.body.isGold,
        phone:req.body.phone
    });
    newCustomer = await newCustomer.save();
    try{
        res.send(newCustomer);
    }
    catch(error){
        res.status(400).send({message:'Failed to add Customer'});
    }
}
export {addCustomer}