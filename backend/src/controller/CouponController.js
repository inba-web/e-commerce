const Coupon = require("../model/Coupon");

class CouponController {
  async getAllCoupons(req, res) {
    try {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      return res.status(200).json(coupons);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async createCoupon(req, res) {
    try {
      const { code, discountPercentage, minimumOrderValue, expirationDate } = req.body;
      if (!code || !discountPercentage) {
        return res.status(400).json({ error: "Code and discount percentage are required" });
      }
      const existing = await Coupon.findOne({ code: code.toUpperCase() });
      if (existing) {
        return res.status(400).json({ error: "Coupon with this code already exists" });
      }
      const newCoupon = new Coupon({
        code: code.toUpperCase(),
        discountPercentage,
        minimumOrderValue: minimumOrderValue || 0,
        expirationDate: expirationDate || null
      });
      await newCoupon.save();
      return res.status(201).json(newCoupon);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteCoupon(req, res) {
    try {
      const { id } = req.params;
      await Coupon.findByIdAndDelete(id);
      return res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async toggleCouponValidity(req, res) {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return res.status(404).json({ error: "Coupon not found" });
      }
      coupon.valid = !coupon.valid;
      await coupon.save();
      return res.status(200).json(coupon);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CouponController();
