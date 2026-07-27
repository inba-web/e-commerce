const User = require("../model/User");
const bcrypt = require("bcrypt");
const VerificationCode = require("../model/VerificationCode");
const CustomerPasswordReset = require("../model/CustomerPasswordReset");
const generateOTP = require("../utils/generateOTP");
const sendVerificataionEmail = require("../utils/sendEmail");
const sellerService = require("./sellerService.js");
const jwtProvider = require("../utils/jwtProvider");
const jwt = require("jsonwebtoken");
const userService = require("./userService");
const Cart = require("../model/Cart.js");
const { getWelcomeOtpTemplate, getCustomerResetPasswordOtpTemplate } = require("../utils/emailTemplates.js");


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

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found with this email");
    }

    const existingReset = await CustomerPasswordReset.findOne({ email });
    if (existingReset) {
      const timeElapsed = Date.now() - existingReset.updatedAt.getTime();
      if (timeElapsed < 60 * 1000) {
        throw new Error("Please wait 1 minute before requesting another OTP resend.");
      }
      await CustomerPasswordReset.deleteOne({ email });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const resetRecord = new CustomerPasswordReset({
      email,
      otp: hashedOtp,
      expiresAt
    });
    await resetRecord.save();

    console.log(`[CUSTOMER RESET OTP FOR ${email}]: ${otp}`);

    const subject = "INBA MART Customer Password Reset OTP";
    const body = getCustomerResetPasswordOtpTemplate(otp);

    try {
      await sendVerificataionEmail(email, subject, body);
      console.log("Customer Reset OTP email sent successfully");
    } catch (emailError) {
      console.error("WARNING: Failed to send reset email (SMTP Authentication Issue):", emailError.message);
      console.log(`[DEVELOPMENT FALLBACK] Please use the OTP from logs above to reset: ${otp}`);
    }
  }

  async verifyResetOtp(email, otp) {
    const record = await CustomerPasswordReset.findOne({ email });
    if (!record || record.expiresAt < new Date()) {
      throw new Error("OTP expired or invalid reset request.");
    }

    if (record.attempts >= 5) {
      throw new Error("Too many verification attempts. Please request a new OTP.");
    }

    const isOtpValid = await bcrypt.compare(otp, record.otp);
    if (!isOtpValid) {
      record.attempts += 1;
      await record.save();
      throw new Error(`Invalid OTP. Attempts remaining: ${5 - record.attempts}`);
    }

    record.isVerified = true;
    await record.save();

    // Sign a short-lived reset token (valid for 10 minutes)
    const secretKey = "poiuytewqasdfghjklnbvcxz";
    const resetToken = jwt.sign({ email, purpose: "reset-password" }, secretKey, { expiresIn: "10m" });
    return resetToken;
  }

  async resetPassword(token, password) {
    const secretKey = "poiuytewqasdfghjklnbvcxz";
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (err) {
      throw new Error("Reset token has expired or is invalid.");
    }

    if (decoded.purpose !== "reset-password") {
      throw new Error("Invalid token purpose.");
    }

    const record = await CustomerPasswordReset.findOne({ email: decoded.email });
    if (!record || !record.isVerified) {
      throw new Error("Reset session expired or OTP verification required.");
    }

    // Validate password strength
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      throw new Error("Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findOneAndUpdate({ email: decoded.email }, { password: hashedPassword });
    await CustomerPasswordReset.deleteOne({ email: decoded.email });
    console.log(`Password reset successfully for ${decoded.email}`);
  }
}


module.exports = new AuthService();
