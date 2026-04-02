const Orders = require('../model/Order.js');
const PaymentOrder = require('../model/PaymentOrder.js');

class PaymentService{
    
    async createOrder(user, order){
        const amount = Orders.reduce((sum,order) => sum+order.totalSellingPrice, 0)

        const paymentOrder = new PaymentOrder({
            amount,
            user:user._id,
            orders:Orders.map(order => order._id)
        })

        return await paymentOrder.save();
    }

    async getPaymentOrderById(orderId) {
        const paymentOrder = await PaymentOrder.findOne(orderId);

        if(!paymentOrder) {
            throw new Error("Payment order not found");
        }

        return paymentOrder;
    } 

    async getPaymentOrderByPaymentLinkId(paymentLinkId){
        const paymentOrder = await PaymentOrder.findOne({paymentLinkId});

        if(!paymentOrder){
            throw new Error("Payment order not found");
        }

        return paymentOrder;
    }

    async createRazorpayPaymentLink(user, amount, orderId){
        try {
            const paymentLinkRequest = {
                amount: amount*100,
                currency: "INR",
                customer:{
                    name: user.fullName,
                    email: user.email,
                },

                notify:{
                    email: true
                },

                callback_url: `http://localhost:3000/payment-success/${orderId}`,
                callback_method: "get"
            }

            const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

            return paymentLink;
        } catch (error) {
            
        }
    }

}