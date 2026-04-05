const TransactionService = require("../service/TransactionService");


class TransactionController {

    async getTransactionBySeller(req, res){
        try {
            const seller = await req.seller;
            const transactions = await TransactionService.getTransactionsBySellerID(seller._id);
            return res.status(200).json(transactions);
        } catch (error) {
            console.log("Error fetching transactions by seller ID:", error);
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new TransactionController();