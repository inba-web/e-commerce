const {default: mongoose} = require("mongoose")
const OrderStatus = require("../domain/OrderStatus")
const PaymentStatus = require("../domain/PaymentStatus")

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Seller",
        required:true
    },
    orderItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"OrderItem"
    }],
    shippingAddress:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Address",
        required:true
    },
    totalMrpPrice:{
        type:Number,
        required:true
    },
    totalSellingPrice:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    orderStatus:{
        type:String,
        enum:Object.values(OrderStatus),
        default:OrderStatus.PENDING
    },
    totalItem:{
        type:Number,
        required:true
    },
    paymentStatus:{
        type:String,
        enum:Object.values(PaymentStatus),
        default:PaymentStatus.PENDING
    },
    orderDate:{
        type: Date,
        default: Date.now
    },
    deliveryDate:{
        type:Date,
        default: function(){
            return Date.now() + 7 * 24 * 60 * 60 * 1000;
        }
    }
})

const Order = new mongoose.model("Order", orderSchema);
module.exports = Order;