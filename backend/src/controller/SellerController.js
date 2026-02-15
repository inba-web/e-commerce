const UserRoles = require("../domain/UserRole");
const VerificationCode = require("../model/VerificationCode");
const sellerService = require("../service/sellerService");
const jwtProvider = require("../utils/jwtProvider");

class SellerController {
  // Bearer token for

  async getSellerProfile(req, res) {
    try {
      const profile = await req.seller;
      console.log(profile)
      const jwt = req.headers.authorization.split(" ")[1];
      const seller = await sellerService.getSellerProfile(jwt);

      res.status(200).json(seller);
    } catch (error) {
      console.log(`Error in getSellerProfile controller: ${error}`);
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async createSeller(req, res) {
    try {
      const seller = await sellerService.createSeller(req.body);

      res.status(200).json({ message: "seller created successfully" });
    } catch (error) {
      console.log(`Error in createSeller controller: ${error}`);
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async getAllSellers(req, res) {
    try {
      const status = req.query.status;
      const seller = await sellerService.getAllSellers(status);

      res.status(200).json(seller);
    } catch (error) {
      console.log(`Error in getAllSellers controller: ${error}`);
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async updateSeller(req, res) {
    try {
      const existingSeller = await req.seller;
      const seller = await sellerService.updateSeller(existingSeller, req.body);

      res.status(200).json(seller);
    } catch (error) {
      console.log(`Error in updateSeller controller: ${error}`);
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async deleteSeller(req, res) {
    try {
      const seller = await sellerService.deleteSeller(req.params.id);

      res.status(200).json({ message: "Seller deleted successfully" });
    } catch (error) {
      console.log(`Error in deleteSeller controller: ${error}`);
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async updateSellerAccountStatus(req, res) {
    try {
      const updatedSeller = await sellerService.updateSellerStatus(
        req.params.id,
        req.params.status,
      );
      res.status(200).json(updatedSeller);
    } catch (error) {
      console.log(`Error in updateSellerAccountStatus controller: ${error}`);
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }

  async verifyLoginOtp(req, res) {
    try {
      const { otp, email } = req.body;
      const seller = await sellerService.getSellerByEmail(email);

      const verificationCode = await VerificationCode.findOne({ email });
      console.log("otp:"+otp)
      console.log("verification bundle : "+verificationCode)
      if(!verificationCode){
        return res.status(400).json({message : "otp not found or expired"})
      }

      if(verificationCode.otp != otp){
        return res.status(400).json({message: "Invalid OTP"})
      }

      const token = jwtProvider.createJwt({ email });

      const authResponse = {
        message: "Login Success",
        jwt: token,
        role: UserRoles.SELLER,
      };

      return res.status(200).json(authResponse);
    } catch (error) {
      console.log(`Error in verifyLoginOTP controller: ${error}`);
      res
        .status(error instanceof Error ? 404 : 500)
        .json({ message: error.message });
    }
  }
}

module.exports = new SellerController();
