const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

router.get('/profile', authMiddleware, userController.getUserProfileByJwt);
router.put('/profile', authMiddleware, userController.updateUserProfile);
router.post('/addresses', authMiddleware, userController.addUserAddress);
router.put('/addresses/:addressId', authMiddleware, userController.updateUserAddress);
router.delete('/addresses/:addressId', authMiddleware, userController.deleteUserAddress);

module.exports = router;