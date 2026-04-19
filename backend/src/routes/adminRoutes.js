const express = require("express");
const SellerController = require("../controller/SellerController");
const router = express.Router();
const dealRoutes = require("./DealRoutes"); // home page deal routes


router.patch("/seller/:id/status/:status", SellerController.updateSellerAccountStatus)

router.use("/deals", dealRoutes);

module.exports = router;