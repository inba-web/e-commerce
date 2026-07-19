const User = require("../model/User");
const bcrypt = require("bcrypt");
const VerificationCode = require("../model/VerificationCode");
const generateOTP = require("../utils/generateOTP");
const sendVerificataionEmail = require("../utils/sendEmail");
const sellerService = require("./sellerService.js");
const jwtProvider = require("../utils/jwtProvider");
const userService = require("./userService");
const Cart = require("../model/Cart.js");
const { getWelcomeOtpTemplate } = require("../utils/emailTemplates.js");

class AuthService {
  async sendLoginOTP(email) {
    const SIGNIN_PREFIX = "signin_";

    if (email.startsWith(SIGNIN_PREFIX)) {
      email = email.substring(SIGNIN_PREFIX.length);
      let seller, user;
      try {
        seller = await sellerService.getSellerByEmail(email);
      } catch (error) { }

      try {
        user = await userService.findUserByEmail(email);
      } catch (error) { }

      if (!seller && !user) throw new Error("User not found");
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
    const body = getWelcomeOtpTemplate(otp);
    try {
      await sendVerificataionEmail(email, subject, body);
      console.log("OTP email sent successfully");
    } catch (emailError) {
      console.error("WARNING: Failed to send verification email (SMTP Authentication Issue):", emailError.message);
      console.log(`[DEVELOPMENT FALLBACK] Please use the OTP from logs above to log in: ${otp}`);
    }

    console.log("OTP saved in DB:", otp);
  }

  async createUser(req) {
    const { email, fullName, mobile, password } = req;

    let user = await User.findOne({ email });

    if (user) {
      throw new Error("User already exists with this email");
    }

    user = new User({
      email,
      fullName,
      mobile,
      password: await bcrypt.hash(password || "12345678", 10),
    });

    await user.save();

    const createdCart = new Cart({ user: user._id });
    await createdCart.save();

    return jwtProvider.createJwt({ email });
  }

  async signin(req) {
    const { email, password } = req;

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found with this email");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return {
      message: "Login Success",
      jwt: jwtProvider.createJwt({ email }),
      role: user.role
    }
  }

}

module.exports = new AuthService();
