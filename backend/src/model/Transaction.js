const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    order:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    seller:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
},{timestamps:true})

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;