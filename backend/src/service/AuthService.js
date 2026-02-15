const User = require("../model/User");
const bcrypt = require("bcrypt");
const VerificationCode = require("../model/VerificationCode");
const generateOTP = require("../utils/generateOTP");
const sendVerificataionEmail = require("../utils/sendEmail");
const sellerService = require("./sellerService");
const jwtProvider = require("../utils/jwtProvider");

class AuthService {
  async sendLoginOTP(email) {
    const SIGNIN_PREFIX = "signin_";

    if (email.startsWith(SIGNIN_PREFIX)) {
      email = email.substring(SIGNIN_PREFIX.length);
      const seller = await sellerService.getSellerByEmail(email);
      if (!seller) throw new Error("User not found");
    }

    const existingVerificationCode = await VerificationCode.findOne({ email });

    if (existingVerificationCode) {
      await VerificationCode.deleteOne({ email });
    }

    const otp = generateOTP();
    const verificationCode = new VerificationCode({ otp, email });
    await verificationCode.save();
    console.log("verification code : " + verificationCode.otp);

    const subject = "INBA MART Login/Signup OTP";
    const body = `Your OTP is ${otp}. Please enter it to complete your login process.`;
    await sendVerificataionEmail(email, subject, body);

    console.log("OTP saved in DB:", otp);
  }

  async createUser(req) {
    const { email, fullName } = req;

    let user = await User.findOne({ email });

    if (user) {
      throw new Error("User already exists with this email");
    }

    user = new User({
      email,
      fullName,
      password: await bcrypt.hash(12345678, 10),
    });

    await user.save();

    const cart = new Cart({ user: user._id });
    await cart.save();

    return jwtProvider.createJwt({ email });
  }

}

module.exports = new AuthService();
