const express = require("express");
const router = express.Router();
const SellerController = require("../controller/SellerController");


router.get("/profile", SellerController.getSellerProfile);
router.post("/", SellerController.createSeller);
router.get("/", SellerController.getAllSellers);
router.patch("/", SellerController.updateSeller);

router.post("/verify/login-otp", SellerController.verifyLoginOtp)

module.exports = router;