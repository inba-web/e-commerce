const mongoose = require("mongoose");

const sellerReportSchema = new mongoose.Schema({
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    totalEarnings:{
        type: Number,
        default: 0
    },
    totalSales:{
        type: Number,
        default: 0
    },
    totalRefunds:{
        type: Number,
        default: 0
    },
    totalTax:{
        type: Number,
        default: 0
    },
    netEarnings:{
        type: Number,
        default: 0
    },
    totalOrders:{
        type: Number,
        default: 0
    },
    cacelOrders:{
        type: Number,
        default: 0
    },
    totalTransactions:{
        type: Number,
        default: 0
    }
},{timestamps: true});

const SellerReport = mongoose.model("SellerReport", sellerReportSchema);
module.exports = SellerReport;