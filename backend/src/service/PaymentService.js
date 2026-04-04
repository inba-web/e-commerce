const OrderStatus = require("../domain/OrderStatus.js");
const PaymentStatus = require("../domain/PaymentStatus.js");
const Orders = require("../model/Order.js");
const PaymentOrder = require("../model/PaymentOrder.js");

class PaymentService {
  async createOrder(user, order) {
    const amount = Orders.reduce(
      (sum, order) => sum + order.totalSellingPrice,
      0,
    );

    const paymentOrder = new PaymentOrder({
      amount,
      user: user._id,
      orders: Orders.map((order) => order._id),
    });

    return paymentOrder.save();
  }

  async getPaymentOrderById(orderId) {
    const paymentOrder = await PaymentOrder.findOne(orderId);

    if (!paymentOrder) {
      throw new Error("Payment order not found");
    }
  }
}

module.exports = new PaymentService();