const { Schema, default: mongoose } = require("mongoose");


const cartSchema = new Schema({
    cart:{
        type:Schema.Types.ObjectId,
        ref:"Cart",
        required:true
    },
    product:{
        type:Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    size:{
        type:String,
        required:true
    },
    quantity:{
        type: Number,
        required: true,
        defualt:1
    },
    mrpPrice:{
        type: Number,
        required: true
    },
    sellingPrice:{
        type: Number,
        required:true
    },
    userId:{
        type:String,
        required:true
    }

})


const CartItem = mongoose.model("CartItem", cartSchema);
module.exports = CartItem;