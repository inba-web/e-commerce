const PaymentService = require("../service/PaymentService.js");
const OrderService = require("../service/OrderService.js");
const Cart = require("../model/Cart.js");
const CartItem = require("../model/CartItem.js");
const TransactionService = require("../service/TransactionService.js");
const SellerService = require("../service/sellerService.js");
const SellerReportService = require("../service/SelllerReportService.js");
const sendVerificataionEmail = require("../utils/sendEmail.js");
const { getInvoiceTemplate } = require("../utils/emailTemplates.js");

async function sendInvoiceEmail(user, orders) {
  const body = getInvoiceTemplate(user, orders);

  try {
    await sendVerificataionEmail(user.email, "Inba Mart - Order Invoice Receipt", body);
    console.log(`[INVOICE EMAIL] Sent consolidated invoice successfully to ${user.email}`);
  } catch (err) {
    console.error(`WARNING: Failed to send consolidated invoice email (SMTP Authentication Issue) to ${user.email}:`, err.message);
    console.log("---------------- [DEVELOPMENT FALLBACK INVOICE EMAIL START] ----------------");
    console.log(`To: ${user.email}`);
    console.log("Subject: Inba Mart - Order Invoice Receipt");
    console.log("Invoice Content (HTML):");
    console.log(body);
    console.log("----------------- [DEVELOPMENT FALLBACK INVOICE EMAIL END] -----------------");
  }
}

const paymentSuccessHandler = async (req, res) => {
  const { paymentId } = req.params;
  const paymentLinkId = req.query.paymentLinkId || (req.body && req.body.paymentLinkId);

  try {
    const user = await req.user;

    const paymentOrder =
      await PaymentService.getPaymentOrderByPaymentLinkId(paymentLinkId);

    const paymentSuccess = await PaymentService.proceedPaymentOrder(
      paymentOrder,
      paymentId,
      paymentLinkId,
    );

    if (paymentSuccess) {
      const populatedOrders = [];
      for (let orderId of paymentOrder.orders) {
        const order = await OrderService.findOrderById(orderId);
        populatedOrders.push(order);

        await TransactionService.createTransaction(order);

        const seller = await SellerService.getSellerById(order.seller);
        const sellerReport = await SellerReportService.getSellerReport(seller);

        sellerReport.totalOrders += 1;
        sellerReport.totalEarnings += order.totalSellingPrice;
        sellerReport.totalSales += order.orderItems.length;

        const updatedReport =
          await SellerReportService.updateSellerReport(sellerReport);
        console.log("updated report : " + updatedReport);
      }

      // Send the email invoice consolidated
      try {
        await sendInvoiceEmail(user, populatedOrders);
      } catch (invoiceErr) {
        console.error("Error sending invoice email helper:", invoiceErr);
      }

      await CartItem.deleteMany({ userId: user._id.toString() });

      await Cart.findOneAndUpdate(
        { user: user._id },
        {
          cartItems: [],
          totalSellingPrice: 0,
          totalItem: 0,
          totalMrpPrice: 0,
          discount: 0,
          couponCode: null,
          couponPrice: 0
        },
        { new: true },
      );

      return res.status(201).json({ message: "Payment Successful" });
    } else {
      return res.status(400).json({ message: "Payment failed" });
    }
  } catch (error) {
    console.error("Payment success handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  paymentSuccessHandler,
};
