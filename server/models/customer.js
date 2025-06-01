const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type : String ,
        required : [true , 'User email is required'],
        lowercase : true ,
        trim : true,
        unique : [true,'Email already registered  '],
        match : [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
       , 'Enter a valid email'
       ]
    },
    totalSpend: { type: Number, default: 0 },
    visits: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
},{
    timestamps:true
})

const Customer = mongoose.model('User',customerSchema) 
module.exports = Customer