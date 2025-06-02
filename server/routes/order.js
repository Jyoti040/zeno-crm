const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getOrderById,
    ingestOrder
} = require('../controllers/order');

router.post('/', ingestOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);

module.exports = router;