const Order = require("../models/order")
const Customer = require('../models/Customer');
const CustomAPIError = require('../error/CustomError')

const ingestOrder = async (req, res,next) => {
    const { customerId, amount, products } = req.body;
    try {
        if (!customerId || !amount || !products || products.length === 0) {
            throw new CustomAPIError('Customer ID, amount, and products are required', 400);
        }

        // Check if customer exists
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ msg: 'Customer not found' });
        }

        const order = new Order({ customerId, amount, products });
        await order.save();

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

const getAllOrders = async (req, res,next) => {
    try {
        const orders = await Order.find().populate('customerId', 'name email'); // Populate customer info
        res.status(200).json(orders);
    } catch (error) {
        next(error)
    }
};

const getOrderById = async (req, res,next) => {
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

module.exports={
    getAllOrders,
    getOrderById,
    ingestOrder
}