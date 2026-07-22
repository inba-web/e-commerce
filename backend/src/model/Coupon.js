const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    minimumOrderValue: {
        type: Number,
        default: 0
    },
    valid: {
        type: Boolean,
        default: true
    },
    expirationDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
