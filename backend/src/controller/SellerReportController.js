const SellerReportService = require("../service/SelllerReportService.js");

class SellerReportController {
  async getSellerReport(req, res) {
    try {
      const seller = req.seller;
      const report = await SellerReportService.getSellerReport(seller);
      res.status(200).json(report);
    } catch (error) {
      console.log(`Error in SellerReportController : ${error}`);
      res.status(400).json({ error: error.message });
    }
  }
}


module.exports = new SellerReportController();