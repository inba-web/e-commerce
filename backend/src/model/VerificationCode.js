const { mongoose } = require("mongoose");

const verificationCodeSchema = new mongoose.Schema({
    otp:{
        type:String,
    },
    email:{
        type:String,
        required:true
    },
})

const VerificationCode = mongoose.model("verificationCode", verificationCodeSchema);
module.exports = VerificationCode;