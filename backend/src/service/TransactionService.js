const Transaction = require("../model/Transaction.js");
const Seller = require("../model/Seller");
const Order = require("../model/Order");


class TransactionService {

    async createTransaction(orderId){
        const order = await Order.findById(orderId).populate('seller');
        if(!order) {
            throw new Error("Order not found");
        }

        const seller = await Seller.findById(order.seller._id);
        if(!seller) {
            throw new Error("Seller not found");
        }

        const transaction = new Transaction({
            seller: seller._id,
            customer: order.user,
            order: order._id
        });

        return await transaction.save();
    }

    async getTransactionsBySellerID(sellerId) {
        return await Transaction.find({ seller: sellerId }).populate('order');
    }

    async getAllTransaction(){
        return await Transaction.find().populate("seller order customer");
    }
}

module.exports = new TransactionService();