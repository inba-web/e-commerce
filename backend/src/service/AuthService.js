const Seller = require("../model/Seller");
const VerificationCode = require("../model/VerificationCode");
const generateOTP = require("../utils/generateOTP");
const sendVerificataionEmail = require("../utils/sendEmail");
const sellerService = require("./sellerService");

class AuthService {
  async sendLoginOTP(email) {
    const SIGNIN_PREFIX = "signin_";

    if (email.startsWith(SIGNIN_PREFIX)) {
      email = email.substring(SIGNIN_PREFIX.length);
      const seller = await sellerService.getSellerByEmail(email);
      if (!seller) throw new Error("User not found");
    }

    await VerificationCode.deleteOne({ email });

    const otp = generateOTP();
    const verificationCode = new VerificationCode({ otp, email });
    await verificationCode.save();

    const subject = "INBA MART Login/Signup OTP";
    const body = `Your OTP is ${otp}. Please enter it to complete your login process.`;
    await sendVerificataionEmail(email, subject, body);

    console.log("OTP saved in DB:", otp);
  }
}

module.exports = new AuthService();
