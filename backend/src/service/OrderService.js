const { default: mongoose } = require("mongoose");
const Order = require("../model/Order");
const OrderItem = require("../model/OrderItem");
const User = require("../model/User");
const OrderStatus = require("../domain/OrderStatus");

class OrderService {
  async createOrder(user, shippingAddress, cart) {
    if (shippingAddress._id && !user.address.includes(shippingAddress._id)) {
      user.addresses.push(shippingAddress._id);
      await User.findByIdAndUpdate(user._id, user);
    }

    if (!shippingAddress._id) {
      shippingAddress = await Address.create(shippingAddress);
    }

    const itemsBySeller = cart.cartItems.reduce((acc, item) => {
      const sellerId = item.product.seller._id.toString();
      acc[sellerId] = acc[sellerId] || [];
      acc[sellerId].push(item);
      return acc;
    }, {});j

    const orders = new Set();

    for (const [sellerId, cartItems] of Object.entries(itemsBySeller)) {
      const totalOrderPrice = cartItems.reduce(
        (sum, item) => sum + item.sellingPrice,
      );
      const totalItem = cartItems.length;

      const newOrder = new Order({
        user: user._id,
        shippingAddress: shippingAddress._id,
        orderItems: [],
        totalMrpPrice: totalOrderPrice,
        totalSellingPrice: totalOrderPrice,
        totalItems: totalItem,
      });

      const orderItems = await Promise.all(
        cartItems.map(async (cartItem) => {
          const orderItem = new OrderItem({
            product: cartItem.product._id,
            quantity: cartItem.quantity,
            sellingPrice: cartItem.sellingPrice,
            mrpPrice: cartItem.mrpPrice,
            size: cartItem.size,
            userId: cartItem.userId,
          });

          const savedOrderItem = await orderItem.save();
          newOrder.orderItem.push(savedOrderItem._id);

          return savedOrderItem;
        }),
      );

      const savedOrder = await newOrder.save();
      orders.add(savedOrder);
    }
    return Array.from(orders);
  }

  async findOrderById(orderId) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid Order ID");
    }

    const order = await Order.findById(orderId).populate([
      { path: "seller" },
      { path: "orderItems", populate: { path: "product" } },
      { path: "shippingAddress" },
    ]);

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }

  async usersOrderHistory(userId) {
    return await Order.findOne({ user: userId }).populate([
      { path: "seller" },
      { path: "orderItems", populate: { path: "product" } },
      { path: "shippingAddress" },
    ]);
  }

  async getSellersOrder(orderId) {
    return await Order.findOne({ seller: orderId })
      .sort({ orderDate: -1 })
      .populate([
        { path: "seller" },
        { path: "orderItems", populate: { path: "product" } },
        { path: "shippingAddress" },
      ]);
  }

  async updateOrderStatus(orderId, status) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid Order ID");
    }

    const order = await this.findOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;

    return await Order.findByIdAndUpdate(orderId, order, {
      new: true,
    }).populate([
      { path: "seller" },
      { path: "orderItems", populate: { path: "product" } },
      { path: "shippingAddress" },
    ]);
  }

  async cancelOrderStatus(orderId, status) {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error("Invalid Order ID");
    }

    const order = await this.findOrderById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }


    if(user._id.toString() !== order.user.toString()){
      throw new Error("Unauthorized to cancel this order");
    }

    order.status = OrderStatus.CANCELLED;

    return await Order.findByIdAndUpdate(orderId, order, {
      new: true,
    }).populate([
      { path: "seller" },
      { path: "orderItems", populate: { path: "product" } },
      { path: "shippingAddress" },
    ]);
  }

  async findOrderItemById(orderItemId){
    if(!mongoose.Types.ObjectId.isValid(orderItemId)){
      throw new Error("Invalid Order Item ID")
    }

    const orderItem = await OrderItem.findById(orderItemId).populate("product");
    
    if(!orderItem){
      throw new Error("Order item not found");
    }

    return orderItem;
  }
  
}


module.exports = new OrderService();