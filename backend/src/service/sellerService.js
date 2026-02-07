const Address = require("../model/Address");
const Seller = require("../model/Seller");
const jwtProvider = require("../utils/jwtProvider");

class SellerService {
  async createSeller(sellerData) {
    const existingSeller = await Seller.findOne({ email: sellerData.email });
    if (existingSeller) {
      throw new Error("Email Already Exists");
    }

    let savedAddress = sellerData.pickupAddress;

    savedAddress = await Address.create(sellerData.pickupAddress);

    const newSeller = new Seller({
      sellerName: sellerData.name,
      email: sellerData.email,
      password: sellerData.password,
      pickupAddress: savedAddress._id,
      GSTIN: sellerData.GSTIN,
      password: sellerData.password,
      mobile: sellerData.mobile,
      bankDetails: sellerData.bankDetails,
      businessDetails: sellerData.businessDetails,
    });

    return await newSeller.save();
  }

  async getSellerProfile(jwt) {
    const email = jwtProvider.getEmailFromjwt(jwt);
    return this.getSellerByEmail(email);
  }

  async getSellerByEmail(email) {
    const seller = await Seller.findOne({ email });

    if (!seller) {
      throw new Error("Seller not found");
    }

    return seller;
  }

  async getSellerById(id) {
    const seller = await Seller.findOne(id);
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
    return await Seller.findByIdAndDelete(sellerId);
  }

}

module.exports = new SellerService();