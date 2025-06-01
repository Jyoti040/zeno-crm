const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true },
    products: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    orderDate: { type: Date, default: Date.now }
},{
    timestamps:true
})

const Order = mongoose.model('Order',orderSchema) 
module.exports = Order