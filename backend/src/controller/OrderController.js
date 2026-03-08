const CartService = require("../service/CartService");
const OrderService = require("../service/OrderService");


class OrderController{

    async createOrder(req, res, next){

        const {shippingAddress} = req.body;
        const { paymentMethod } = req.query;
        const jwt = req.header.authorization;

        try {
            const user = await req.user;

            const cart = await CartService.findUserCart(user);
            const orders = await OrderService.createOrder(user, shippingAddress, cart);

            return res.status(200).json(orders);
        } catch (error) {
            console.log(`Error in createOrder controller :  : ${error}`)
            return res.status(500).json({error:error.message})
        }
    }

    async getOrderById(req, res, next){
        try {
            const {orderId} = req.params;
            const order = await OrderService.findOrderById(orderId);
            return res.status(200).json(order)
        } catch (error) {
            console.log(`Error in getOrderById controller :  : ${error}`)
            return res.status(500).json({error:error.message})
        }
    }

    async getOrderItemById(orderItemId){
        try {
            const {orderItemId} = req.params;
            const orderItem = await OrderService.findOrderItemById(orderItemId);
            return res.status(200).json(orderItem);
        } catch (error) {
            console.log(`Error in getOrderItemById controller :  : ${error}`)
            return res.status(500).json({error:error.message})
        }
    }
}