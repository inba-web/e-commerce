const express = require("express");
const router = express.Router();
const SellerController = require("../controller/SellerController");
const sellerMiddleware = require("../middlewares/sellerAuthMiddleware");

router.get("/profile", sellerMiddleware, SellerController.getSellerProfile);
router.post("/", sellerMiddleware, SellerController.createSeller);
router.get("/", sellerMiddleware, SellerController.getAllSellers);
router.patch("/", sellerMiddleware, SellerController.updateSeller);

router.post("/verify/login-otp", SellerController.verifyLoginOtp);

module.exports = router;
