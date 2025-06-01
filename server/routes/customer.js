const express = require('express');
const router = express.Router();
const {ingestCustomer , getAllCustomers , getCustomerById } = require('../controllers/customer');

router.post('/', ingestCustomer);
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);

module.exports = router;