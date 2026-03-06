const Order = require("../model/Order");
const OrderItem = require("../model/OrderItem");
const User = require("../model/User");


class OrderService {
  async createOrder(user, shippingAddress, cart) {
    if (shippingAddress._id && !user.address.includes(shippingAddress._id)) {
      user.addresses.push(shippingAddress._id);
      await User.findByIdAndUpdate(user._id, user);
    }

    if(!shippingAddress._id){
        shippingAddress = await Address.create(shippingAddress)
    }


    const itemsBySeller = cart.cartItems.reduce((acc,item) => {
        const sellerId = item.product.seller._id.toString();
        acc[sellerId] = acc[sellerId] || [];
        acc[sellerId].push(item);
        return acc;
    },{})

    const orders = new Set();

    for(const [sellerId, cartItems] of Object.entries(itemsBySeller)){
        const totalOrderPrice = cartItems.reduce((sum, item) => sum + item.sellingPrice)
        const totalItem = cartItems.length;

        const newOrder = new Order({
            user: user._id,
            shippingAddress: shippingAddress._id,
            orderItems: [],
            totalMrpPrice: totalOrderPrice,
            totalSellingPrice: totalOrderPrice,
            totalItems: totalItem,
        })

        const orderItems = await Promise.all(
          cartItems.map(async (cartItem) => {
            const orderItem = new OrderItem({
              product: cartItem.product._id,
              quantity: cartItem.quantity,
              sellingPrice: cartItem.sellingPrice,
              mrpPrice: cartItem.mrpPrice,
              size: cartItem.size,
              userId: cartItem.userId
            })

            const savedOrderItem = await orderItem.save();
            newOrder.orderItem.push(savedOrderItem._id);

            return savedOrderItem;
          })
        )

        const savedOrder = await newOrder.save();
        orders.add(savedOrder);
    }
    return Array.from(orders);
  }
}
