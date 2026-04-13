const {default: mongoose} = require('mongoose');

const dealSchema = new mongoose.Schema({
    discout:{
        type: Number,
        required: true
    },
    categroy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "HomeCategory",
        rquired: true
    },
}) 

const Deal = new mongoose.model("Deal",dealSchema);

module.exports = Deal;