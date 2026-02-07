const {Schema} = require("mongoose")

const verificationCodeSchema = new Schema({
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