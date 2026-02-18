const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        required: true,
        trim: true
    },
    mrpPrice:{
        typeof: Number,
        required: true
    },
    sellingPrice:{
        typeof: Number,
        required: true,
    },
    discountPercent:{
        typeof: Number,
        required: true,
    },
    quantity:{
        typeof: Number,
        required: true
    },
    images:{
        type: [String],
        required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    size:{
        type: String,
        required: true
    }
})

const Product = mongoos.model("Product",productSchema);
module.exports = Product;