const Customer = require('../models/Customer');
const CustomAPIError = require('../errors/CustomError')

// @route   POST /api/customers
// @desc    Ingest a new customer
// @access  Public (should be protected)
const ingestCustomer = async (req, res , next) => {
    const { name, email } = req.body;
    try {
        if (!name || !email) {
              throw new CustomAPIError('Please provide name and email', 400);
        }

        let customer = await Customer.findOne({ email });
        if (customer) {
           throw new CustomAPIError('Email already exists, please register with unique credentials', 409);
        }

        customer = new Customer({ name, email});
        await customer.save();
        res
          .status(201)
          .json({
            status:'success',
            message:'customer registered successfully',
            customer
        });
    } catch (error) {
       next(error);
    }
};

// @route   GET /api/customers
// @desc    Get all customers
// @access  Public (should be protected)
const getAllCustomers = async (req, res,next) => {
    try {
        const customers = await Customer.find();
        res
          .status(200)
          .json({
            status:'success',
            customers
          });
    } catch (error) {
        next(error)
    }
};

// @route   GET /api/customers/:id
// @desc    Get customer by ID
// @access  Public (should be protected)
const getCustomerById = async (req, res,next) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {

            throw new CustomAPIError('Customer not found', 404);
        }
        res
          .status(200)
          .json({
            status:'success',
            customer
          });
    } catch (error) {
        next(error)
    }
};

module.exports = {
    ingestCustomer,
    getAllCustomers,
    getCustomerById
}