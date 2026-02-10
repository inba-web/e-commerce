const Seller = require("../model/Seller");
const VerificationCode = require("../model/VerificationCode");
const generateOTP = require("../utils/generateOTP");
const sendVerificataionEmail = require("../utils/sendEmail");

class AuthService {
  async sendLoginOTP(email) {
    const SIGNIN_PREFIX = "signin_";

    if (email.startswith(SIGNIN_PREFIX)) {
      const seller = await Seller.findOne({ email });

      if (!seller) throw new Error("User not found");
    }

    const existingVerificationCode = await VerificationCode.findOne({ email });

    if (existingVerificationCode) {
      await VerificationCode.deleteOne({ email });

      const otp = generateOTP();
      const verificationCode = new VerificationCode({ otp, email });
      await verificationCode.save();

      // send email to user
      const subject = "INBA MART Login/Signup OTP";
      const body = `Your OTP is ${otp}. Please enter it to complete your login process.`;
      await sendVerificataionEmail(email, subject, body);
    }
  }
}

module.exports = new AuthService();