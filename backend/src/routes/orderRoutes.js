const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const OrderController = require('../controller/OrderController');
const router = express.Router();

router.post('/', authMiddleware, OrderController.createOrder);

router.get('/user', authMiddleware, OrderController.getUserHistory);

router.delete('/user/clear-history', authMiddleware, OrderController.clearOrderHistory);

router.put('/:orderId/cancel', authMiddleware, OrderController.cancelOrder);

router.delete('/:orderId', authMiddleware, OrderController.deleteOrderHistory);

router.get('/:orderId', authMiddleware, OrderController.getOrderById);

router.get('/item/:orderItemId', authMiddleware, OrderController.getOrderItemById);

module.exports = router;