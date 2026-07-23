const Deal = require("../model/Deal");
const HomeCategory = require("../model/HomeCategory");

class DealService {
  async getDeals() {
    return await Deal.find().populate({ path: "category" });
  }

  async createDeals(deal) {
    try {
      const category = await HomeCategory.findById(deal.category._id);

      const newDeal = new Deal({
        ...deal,
        category: category,
      });
      const saveDeal = await newDeal.save();
      return await Deal.findById(saveDeal._id).populate({ path: "category" });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateDeal(deal, id) {
    const existingDeal = await Deal.findById(id).populate({
      path: "category",
    });

    if (existingDeal) {
      return await Deal.findByIdAndUpdate(
        existingDeal._id,
        { discout: deal.discout },
        { new: true },
      );
    }

    throw new Error("Deal Not Found");
  }

  async deleteDeal(id) {
    const deal = await Deal.findById(id);

    if (!deal) {
      throw new Error("Deal Not found");
    }

    await Deal.deleteOne({ _id: id });
  }

}

module.exports = new DealService();