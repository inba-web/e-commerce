const mongoose = require("mongoose");
const {Schema} = mongoose;

const orderItemSchema = new Schema({
    product: {
        type:Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    size:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    mrpPrice:{
        type:Number,
        required:true,
    },
    sellingPrice:{
        type:Number,
        required:true
    },
}, {timestamps: true});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
module.exports = OrderItem;