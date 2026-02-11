const express = require("express");
const AuthController = require("../controller/AuthController");
const router = express.Router()

router.post("/sent/login-signup-otp", AuthController.sendLoginOTP);

module.exports = router;