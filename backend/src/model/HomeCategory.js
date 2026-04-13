const mongoose = require("mongoose");
const HomeCategorySection = require("../domain/HomeCategorySection");
const {Schema} = mongoose;

const homeCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    Image: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    },
    section: {
        type: String,
        enum: Object.values(HomeCategorySection),
        required: true
    }
}, {timestamps: true});

const HomeCategory = mongoose.model("HomeCategory", homeCategorySchema);
module.exports = HomeCategory;