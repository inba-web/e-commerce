const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const OrderController = require('../controller/OrderController');
const router = express.Router();

router.post('/', authMiddleware, OrderController.createOrder);

router.get('/user', authMiddleware, OrderController.getUserHistory);

router.put('/:orderId/cancel', authMiddleware, OrderController.cancelOrder);

router.get('/:orderId', authMiddleware, OrderController.getOrderById);

router.get('/item/:orderItemId', authMiddleware, OrderController.getOrderItemById);

module.exports = router;