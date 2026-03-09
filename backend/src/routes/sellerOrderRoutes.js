const express = require("express");
const router = express.Router();
const sellerMiddleware = require("../middlewares/sellerAuthMiddleware.js");
const OrderController = require("../controller/OrderController.js");


router.get('/', sellerMiddleware, OrderController.getSellersOrders);

router.patch('/:orderId/status/:orderStatus', sellerMiddleware, OrderController.updateOrdeStatus);

module.exports = router;