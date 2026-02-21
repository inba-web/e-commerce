const express = require("express");
const ProductController = require("../controller/ProductController");
const sellerMiddleware = require("../middlewares/sellerAuthMiddleware");
const router = express.Router();

router.get("/", sellerMiddleware,ProductController.getProductBySellerId);
router.post("/", sellerMiddleware, ProductController.createProduct);
router.delete("/:productId", sellerMiddleware, ProductController.deleteProduct);
router.patch("/:productId", sellerMiddleware, ProductController.updateProduct);

module.exports = router;