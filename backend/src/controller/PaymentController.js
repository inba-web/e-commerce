const PaymentService = require("../service/PaymentService");



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
            }
        }
    } catch (error) {
        console.error("Payment success handler error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}