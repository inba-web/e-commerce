const CartService = require("../service/CartService");
const OrderService = require("../service/OrderService");

class OrderController {
  async createOrder(req, res, next) {
    const { shippingAddress } = req.body;
    const { paymentMethod } = req.query; 
    // const jwt = req.header.authorization;

    try {
      const user = await req.user;

      const cart = await CartService.findUserCart(user);
      const orders = await OrderService.createOrder(
        user,
        shippingAddress,
        cart,
      );

      return res.status(200).json(orders);
    } catch (error) {
      console.log(`Error in createOrder controller :  : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }

  async getOrderById(req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await OrderService.findOrderById(orderId);
      return res.status(200).json(order);
    } catch (error) {
      console.log(`Error in getOrderById controller :  : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }

  async getOrderItemById(orderItemId) {
    try {
      const { orderItemId } = req.params;
      const orderItem = await OrderService.findOrderItemById(orderItemId);
      return res.status(200).json(orderItem);
    } catch (error) {
      console.log(`Error in getOrderItemById controller :  : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }

  async getUserHistory(req, res) {
    try {
      const userId = req.user._id;
      const orderHistory = await OrderService.usersOrderHistory(userId);
      return res.status(200).json(orderHistory);
    } catch (error) {
      console.log(`Error in getUserHistory controller :  : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }

  async getSellersOrders(req, res) {
    try {
      const sellerId = req.seller._id;
      const orders = OrderService.getSellersOrder(sellerId);
      return res.status(200).json(orders);
    } catch (error) {
      console.log(`Error in getSellerOrders controller :  : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }

  async updateOrdeStatus(req, res) {
    try {
      const { orderId, status } = req.params;
      const updateOrderStatus = OrderService.updateOrderStatus(orderId, status);
      return res.status(200).json(updateOrderStatus);
    } catch (error) {
      console.log(`Error in updateOrderStatus controller :  : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }

  async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user._id;
      const cancelOrder = await OrderService.cancelOrder(orderId, userId);
      return res
        .status(200)
        .json({ message: "Order Cancelled Successfully", order: cancelOrder });
    } catch (error) {
      console.log(`Error in cancelOrder controller :  : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }

}

module.exports = new OrderController();