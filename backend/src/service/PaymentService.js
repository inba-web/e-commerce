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

    return await paymentOrder.save();
  }

  async getPaymentOrderById(orderId) {
    const paymentOrder = await PaymentOrder.findOne(orderId);

    if (!paymentOrder) {
      throw new Error("Payment order not found");
    }

    return paymentOrder;
  }

  async getPaymentOrderByPaymentLinkId(paymentLinkId) {
    const paymentOrder = await PaymentOrder.findOne({ paymentLinkId });

    if (!paymentOrder) {
      throw new Error("Payment order not found");
    }

    return paymentOrder;
  }

  async proceedPaymentOrder(paymentOrder, paymentId, paymentLinkId){

    if(paymentOrder.status !== PaymentStatus.PENDING){
        const payment = await razorpay.payment.fetch(paymentId);

        if(payment.status === "captured"){
            await Promisea.all(paymentOrder.orders.map(async (orderId) => {
                const order = await Orders.findById(orderId);
                order.paymentStatus = PaymentStatus.COMPLETED;
                order.orderStatus = OrderStatus.PLACED;
                await order.save();
            }));

            paymentOrder.status = PaymentStatus.COMPLETED;
            await paymentOrder.save(); 

            return true;
        }else{
            paymentOrder.status = PaymentStatus.FAILED;
            await paymentOrder.save();

            await Promise.all(paymentOrder.orders.map(async (orderId) => {
                const order = await Orders.findById(orderId);
                order.paymentStatus = PaymentStatus.FAILED;
                order.orderStatus = OrderStatus.CANCELLED;
                await order.save();
            }));

            return false;
        } 

    }

    return false;
  } 

  async createRazorpayPaymentLink(user, amount, orderId) {
    try {
      const paymentLinkRequest = {
        amount: amount * 100, 
        currency: "INR",
        customer: {
          name: user.fullName,
          email: user.email,
        },

        notify: {
          email: true,
        },

        callback_url: `http://localhost:3000/payment-success/${orderId}`,
        callback_method: "get",
        expire_by: Math.floor(Date.now()/1000) + (60*60) 
      };

      const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

      return paymentLink;
    } catch (error) {
      console.error("Razorpay payment link error:", error);
      throw new Error("Unable to create payment link");
    }
  }
}

module.exports = new PaymentService();