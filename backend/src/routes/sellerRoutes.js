const express = require("express");
const router = express.Router();
const SellerController = require("../controller/SellerController");
const sellerMiddleware = require("../middlewares/sellerAuthMiddleware");

router.get("/profile", sellerMiddleware, SellerController.getSellerProfile);
router.post("/", SellerController.createSeller);
router.get("/", sellerMiddleware, SellerController.getAllSellers);
router.patch("/", sellerMiddleware, SellerController.updateSeller);

router.post("/verify/login-otp", SellerController.verifyLoginOtp);
router.post("/login", SellerController.loginWithPassword);
router.post("/forget-password", SellerController.forgetPassword);
router.post("/reset-password", SellerController.resetPassword);

module.exports = router;