const {default: mongoose} = require("mongoose");
const PaymentStatus = require("../domain/PaymentStatus");

const paymentOrderSchema = new mongoose.Schema({

    amount:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING
    },
    paymentMethod:{
        type: String,
        default: "RAZORPAY"
    },
    paymentLinkId:{
        type: String,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orders: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    }
})

const PaymentOrder = new mongoose.model("PaymentOrder",paymentOrderSchema)
module.exports = PaymentOrder;