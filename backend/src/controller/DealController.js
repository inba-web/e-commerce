const DealService = require("../service/DealService");

class DealController {
  async getAllDeals(req, res) {
    try {
      const deals = await DealService.getDeals();
      return res.status(200).json(deals);
    } catch (error) {
      console.log(`Error in getAllDeals Controller : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }

  async createDeals(req, res) {
    try {
      const deal = req.body;
      const createDeal = await DealService.createDeals(deal);

      return res.status(201).json(createDeal);
    } catch (error) {
      console.log(`Error in createDeals Controller : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }

  async updateDeal(req, res) {
    const { id } = req.params;
    const deal = req.body;
    try {
      const updatedDeal = await DealService.updateDeal(deal, id);
      return res.status(200).json(updatedDeal);
    } catch (error) {
      console.log(`Error in updateDeal Controller : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteDeal(req, res){
    const {id} = req.params;
    try {
        await DealService.deleteDeal(id);
        return res.status(200).json({message: "Deal Deleted Successfully"})
    } catch (error) {
      console.log(`Error in deleteDeal Controller : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new DealController();