const express = require("express");
const SellerController = require("../controller/SellerController");

const router = express.Router();


router.get("/profile", SellerController.getSellerProfile);
router.post("/", SellerController.createSeller);
router.get("/", SellerController.getAllSellers);
router.patch("/", SellerController.updateSeller);

router.post("/verify/login-otp", SellerController.verifyLoginOtp)