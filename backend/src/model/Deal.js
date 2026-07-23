const {default: mongoose} = require('mongoose');

const dealSchema = new mongoose.Schema({
    discout:{
        type: Number,
        required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "HomeCategory",
        required: true
    },
}) 

const Deal = new mongoose.model("Deal",dealSchema);

module.exports = Deal;