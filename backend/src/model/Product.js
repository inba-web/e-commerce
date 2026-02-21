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
        type: Number,
        required: true,
        min: 0
    },
    sellingPrice:{
        type: Number,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    discountPercent:{
        type: Number,
        required: true,
    },
    quantity:{
        type: Number,
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

const Product = mongoose.model("Product",productSchema);
module.exports = Product;