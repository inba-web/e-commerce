const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
    },
    categoryId: {
        type: String,
        unique: true,
        required: true
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        default: null,
    },
    level: {
        type: Number,
        required: true,
    },
}, {timestamps: true})

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;