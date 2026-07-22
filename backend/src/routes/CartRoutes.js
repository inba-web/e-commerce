const express = require('express');
const cartController = require('../controller/CartController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/', authMiddleware, cartController.findUserCartHandler);

router.put('/add', authMiddleware, cartController.addItemToCart);

router.delete('/item/:cartItemId', authMiddleware, cartController.deleteCartItem);

router.put('/item/:cartItemId', authMiddleware, cartController.updateCartItemHandler);

router.post('/coupon/apply', authMiddleware, cartController.applyCoupon);
router.post('/coupon/remove', authMiddleware, cartController.removeCoupon);

module.exports = router;