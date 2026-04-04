const PaymentService = require("../service/PaymentService.js");
const OrderService = require("../service/OrderService.js"); 
const Cart = require("../model/Cart.js");


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

                // await TransactionService.createTransaction(order);

                const seller = await SellerService.getSellerById(order.seller);
                // const sellerReport = await SellerReportService.getSellerReport(seller);

                sellerReport.totalOrders += 1;
                sellerReport.totalEarnings += order.totalSellingPrice;
                sellerReport.totalSales += order.orderItems.length;

                // const updatedReport = await SellerReportService.updateSellerReport(sellerReport);
                console.log("updated report : "+ updatedReport);
            } 

            await Cart.findOneAndUpdate(
                {user: user._id},
                {cartItems: []},
                {new: true}
            );

            return res.status(201).json({message: "Payment Successful"});
        }else{
            return res.status(400).json({message: "Payment failed"});
        }
    } catch (error) {
        console.error("Payment success handler error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}