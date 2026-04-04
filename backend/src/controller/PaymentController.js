const PaymentService = require("../service/PaymentService.js");
const OrderService = require("../service/OrderService.js"); 


const paymentSuccessHandler = async (req, res) => {
    const {paymentId} = req.params;
    const { paymentLinkId } = req.body;

    try {
        const user = await req.user;

        const paymentOrder = await PaymentService.getPaymentOrderByPaymentLinkId(paymentLinkId);

        const paymentSuccess = await PaymentService.proceedPaymentOrder(paymentOrder,paymentId, paymentLinkId);

        if(paymentSuccess){
            for(let orderId of paymentOrder.orders){
                const order = await OrderService.findOrderById(orderId);

                await TransactionService.createTransaction(order);

                const seller = await SellerService.getSellerById(order.seller);
                const sellerReport = await SellerReportService.getSellerReport(seller);

                sellerReport.totalOrders += 1;
                sellerReport.totalEarnings += order.totalSellingPrice;
                sellerReport.totalSales += order.orderItems.length;

                const updatedReport = await SellerReportService.updateSellerReport(sellerReport);
                console.log("updated report : "+ updatedReport);
            }
        }
    } catch (error) {
        console.error("Payment success handler error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}