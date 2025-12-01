// make contact mongoose model 
const { response } = require('express');
const mongoose= require('mongoose');
const { type } = require('os');

const contactSchema= new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    phone: {type: String},
    subject: {type: String, required: true},
    message: {type: String, required: true},
    response:{type: String , default: "" },
    createdAt: {type: Date, default: Date.now}
})
module.exports= mongoose.model('Contact', contactSchema);
