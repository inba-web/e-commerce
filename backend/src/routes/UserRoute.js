const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

router.get('/profile', authMiddleware, userController.getUserProfileByJwt);
module.exports = router;