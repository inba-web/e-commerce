const express = require("express");
const SellerController = require("../controller/SellerController");
const CouponController = require("../controller/CouponController");
const AdminDashboardController = require("../controller/AdminDashboardController");
const router = express.Router();
const dealRoutes = require("./DealRoutes"); // home page deal routes


router.get("/sellers", SellerController.getAllSellers);
router.patch("/seller/:id/status/:status", SellerController.updateSellerAccountStatus)

router.get("/dashboard/stats", AdminDashboardController.getDashboardStats);

router.get("/coupons", CouponController.getAllCoupons);
router.post("/coupons", CouponController.createCoupon);
router.delete("/coupons/:id", CouponController.deleteCoupon);
router.patch("/coupons/:id/toggle", CouponController.toggleCouponValidity);

router.use("/deals", dealRoutes);

module.exports = router;