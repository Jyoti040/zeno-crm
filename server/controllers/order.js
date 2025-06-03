const Order = require("../models/order")
const Customer = require('../models/customer');
const CustomAPIError = require('../error/CustomError')
const mongoose = require('mongoose');

const ingestOrder = async (req, res, next) => {
    console.log("in ingest order ", req.body)
    let { customerId, amount, products } = req.body;
    try {
        if (!customerId || !amount || !products || products.length === 0) {
            throw new CustomAPIError('Customer ID, amount, and products are required', 400);
        }

        // Check if customer exists
        customerId = new mongoose.Types.ObjectId(customerId);
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ msg: 'Customer not found' });
        }
        amount = Number(amount);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({ msg: 'Amount must be a valid number greater than 0' });

        }

        const cleanedProducts = products.map((p) => ({
            name: p.name,
            quantity: parseInt(p.quantity),
            price: parseFloat(p.price)
        }));

        // Validate each product
        const invalidProduct = cleanedProducts.find(p => !p.name || isNaN(p.quantity) || isNaN(p.price));
        if (invalidProduct) {
            return res.status(400).json({ msg: 'Each product must have valid name, quantity, and price' });
        }

        console.log("before new order")
        const order = new Order({ customerId, amount, products: cleanedProducts });

        await order.save();
        console.log("after new order")

        // Update customer's totalSpend and visits (simple update, can be more complex)
        customer.totalSpend += amount;
        customer.visits += 1;
        customer.lastActivity = Date.now();
        await customer.save();

        res.status(201).json(order);
    } catch (error) {
        next(error)
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('customerId', 'name email'); // Populate customer info
        res.status(200).json(orders);
    } catch (error) {
        next(error)
    }
};

const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('customerId', 'name email');
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        next(error)
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    ingestOrder
}