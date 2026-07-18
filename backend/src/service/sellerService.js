const Address = require("../model/Address");
const Seller = require("../model/Seller");
const jwtProvider = require("../utils/jwtProvider");
const bcrypt = require("bcrypt");
const VerificationCode = require("../model/VerificationCode");
const generateOTP = require("../utils/generateOTP");
const sendVerificataionEmail = require("../utils/sendEmail");
const { getResetPasswordOtpTemplate } = require("../utils/emailTemplates.js");

class SellerService {
  async createSeller(sellerData) {
    const existingSeller = await Seller.findOne({ email: sellerData.email });
    if (existingSeller) {
      throw new Error("Email Already Exists!");
    }
    let savedAddress = null;

    if (
      sellerData.pickupAddress &&
      typeof sellerData.pickupAddress === "object"
    ) {
      savedAddress = await Address.create(sellerData.pickupAddress);
    }

    const hashedPassword = await bcrypt.hash(sellerData.password || "12345678", 10);

    const newSeller = new Seller({
      sellerName: sellerData.sellerName,
      email: sellerData.email,
      password: hashedPassword,
      pickupAddress: savedAddress ? savedAddress._id : null,
      GSTIN: sellerData.GSTIN,
      mobile: sellerData.mobile,
      bankDetails: sellerData.bankDetails,
      businessDetails: sellerData.businessDetails,
    });

    return await newSeller.save();
  }

  async loginWithPassword(email, password) {
    const seller = await Seller.findOne({ email }).select("+password");
    if (!seller) {
      throw new Error("Invalid Email or Password");
    }

    if (seller.accountStatus === "PENDING_VERIFICATION") {
      throw new Error("Your account is pending verification. Please wait for admin approval.");
    }
    if (seller.accountStatus === "SUSPENDED" || seller.accountStatus === "DEACTIVATED") {
      throw new Error("Your store account is suspended or inactive. Please contact Admin.");
    }

    const isPasswordValid = await bcrypt.compare(password, seller.password);
    if (!isPasswordValid) {
      throw new Error("Invalid Email or Password");
    }

    return {
      message: "Login Success",
      jwt: jwtProvider.createJwt({ email }),
      role: seller.role
    };
  }

  async forgetPassword(email) {
    const seller = await Seller.findOne({ email });
    if (!seller) {
      throw new Error("Seller with this email does not exist");
    }

    await VerificationCode.deleteOne({ email });

    const otp = generateOTP();
    const verificationCode = new VerificationCode({ otp, email });
    await verificationCode.save();

    const subject = "INBA MART Seller Password Reset OTP";
    const body = getResetPasswordOtpTemplate(otp);
    try {
      await sendVerificataionEmail(email, subject, body);
      console.log("Password reset OTP email sent successfully to", email);
    } catch (emailError) {
      console.error("WARNING: Failed to send password reset email (SMTP Authentication Issue):", emailError.message);
      console.log(`[DEVELOPMENT FALLBACK] Please use the OTP from logs above to reset password: ${otp}`);
    }
  }

  async resetPassword(email, otp, newPassword) {
    const seller = await Seller.findOne({ email });
    if (!seller) {
      throw new Error("Seller with this email does not exist");
    }

    const verificationCode = await VerificationCode.findOne({ email });
    if (!verificationCode || verificationCode.otp != otp) {
      throw new Error("Invalid OTP or expired");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Select password field to allow update safely
    await Seller.findOneAndUpdate({ email }, { password: hashedPassword });
    await VerificationCode.deleteOne({ email });
  }

  async getSellerProfile(jwt) {
    const email = jwtProvider.getEmailFromjwt(jwt);
    return this.getSellerByEmail(email);
  }

  async getSellerByEmail(email) {
    console.log("seller email : ", email)
    const seller = await Seller.findOne({ email });

    if (!seller) {
      throw new Error("Seller not found");
    }

    return seller;
  }

  async getSellerById(id) {
    const seller = await Seller.findById(id);
    if (!seller) {
      throw new Error("Seller not found");
    }

    return seller;
  }

  async getAllSellers(status) {
    return await Seller.find({ accountStatus: status });
  }

  async updateSeller(existingSeller, sellerData) {
    return await Seller.findByIdAndUpdate(existingSeller._id, sellerData, {
      new: true,
    });
  }

  async updateSellerStatus(sellerId, status) {

    return Seller.findByIdAndUpdate(
      sellerId,
      { $set: { accountStatus: status } },
      { new: true },
    );
  }

  async deleteSeller(sellerId) {
    const seller = await Seller.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }
    return await Seller.findByIdAndDelete(sellerId);
  }
}

module.exports = new SellerService();