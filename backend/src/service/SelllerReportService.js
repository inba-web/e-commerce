const SellerReport = require("../model/SellerReport.js");

class SellerReportService{

    async getSellerReport(seller){
        try {
            let sellerReport = await SellerReport.findOne({seller:seller._id})
            console.log("Seller Report : ", sellerReport);

            if(!sellerReport){
                sellerReport = new SellerReport({
                    seller: seller._id,
                    totalOrders: 0,
                    totalEarnings: 0,
                    totalSales: 0,
                });

                sellerReport = await sellerReport.save();
            }

            return sellerReport;
        } catch (error) {
            throw new Error(`Error Fetching seller Report : ${error.message}`);
        }
    }

    async updateSellerReport(sellerReport){
        try {
            return await SellerReport.findByIdAndUpdate(sellerReport._id,sellerReport,{new : true});
        } catch (error) {
            throw new Error(`Error in updateseller Report : ${error.message}`);
        }
    }
}



module.exports = new SellerReportService();