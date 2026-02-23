const Cart = require("../model/Cart.js");
const CartItem = require("../model/CartItem.js");
const { calculateDiscountPercentage } = require("./ProductService.js");

class CartService {
  async findUserCart(user) {
    let cart = await Cart.findOne({ user: user._id }).populate("cartItem");

    
    if (!cart) {
      throw new Error("Cart not found for user");
    }
    
    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = cart.cartItems.length;

    cart.cartItems.forEach((cartItem) => {
      totalPrice += cartItem.mrpPrice;
      totalDiscountedPrice += cartItem.sellingPrice;
    });

    cart.totalMrpPrice = totalPrice;
    cart.totalSellingPrice = totalDiscountedPrice;
    cart.totalItems = totalItem;
    cart.discount = calculateDiscountPercentage(
      totalPrice,
      totalDiscountedPrice,
    );

    let cartItems = await CartItem.find({ cart: cart._id }).populate("product");
    cart.cartItems = cartItems;

    return cart;
  }

  async addCartItem(user, product, size, quantity) {
    const cart = await this.findUserCart(user);

    let isPresent = await CartItem.findOne({
      cart: cart._id,
      product: product._id,
      size: size,
    }).populate("product");

    if (!isPresent) {
      const cartItem = new CartItem({
        product,
        quantity,
        userId: user._id,
        sellingPrice: quantity * product.sellingPrice,
        mrpPrice: quantity * product.mrpPrice,
        size,
        cart: cart._id,
      });
      await cartItem.save();
    }

    return isPresent;
  }
}

module.exports = new CartService();
