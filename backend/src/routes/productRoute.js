const express = require('express');
const ProductController = require('../controller/ProductController.js');

const router = express.Router();


router.get("/search", ProductController.searchProduct);
router.get("/", ProductController.getAllProducts);
router.get("/:productId", ProductController.getProductById);

module.exports = router;