const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware.js");
const paymentController = require("../controller/PaymentController.js");


router.get("/:paymentId", authMiddleware, paymentController.paymentSuccessHandler);