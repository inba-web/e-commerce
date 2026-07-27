const express = require("express");
const AuthController = require("../controller/AuthController");
const rateLimiter = require("../middlewares/rateLimiter");
const router = express.Router();

router.post("/sent/login-signup-otp", AuthController.sendLoginOTP);
router.post('/signup', AuthController.createUser);
router.post('/signin', AuthController.signin);

// Customer Password Recovery
router.post('/forgot-password', rateLimiter({ windowMs: 15 * 60 * 1000, max: 5, message: "Too many forgot password requests. Please try again after 15 minutes." }), AuthController.forgotPassword);
router.post('/verify-reset-otp', rateLimiter({ windowMs: 15 * 60 * 1000, max: 10, message: "Too many verification attempts. Please request a new OTP." }), AuthController.verifyResetOtp);
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;