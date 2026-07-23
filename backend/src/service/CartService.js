const Cart = require("../model/Cart.js");
const CartItem = require("../model/CartItem.js");
const { calculateDiscountPercentage } = require("./ProductService.js");

class CartService {
  async findUserCart(user) {
    let cart = await Cart.findOne({ user: user._id }).populate("cartItems");

    if (!cart) {
      cart = new Cart({
        user: user._id,
        cartItems: [],
      });
      await cart.save();
    }
    let cartItems = await CartItem.find({ cart: cart._id }).populate("product");
    cart.cartItems = cartItems;

    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = cartItems.length;

    cartItems.forEach((cartItem) => {
      totalPrice += cartItem.mrpPrice || 0;
      totalDiscountedPrice += cartItem.sellingPrice || 0;
    });

    cart.totalMrpPrice = totalPrice;
    cart.totalItem = totalItem;
    cart.totalItems = totalItem;
    cart.discount =
      totalPrice > 0
        ? calculateDiscountPercentage(totalPrice, totalDiscountedPrice)
        : 0;

    // Coupon calculation logic
    if (cart.couponCode) {
      const Coupon = require("../model/Coupon");
      const coupon = await Coupon.findOne({ code: cart.couponCode.toUpperCase() });
      if (coupon && coupon.valid && (totalDiscountedPrice >= coupon.minimumOrderValue) && (!coupon.expirationDate || new Date(coupon.expirationDate) > new Date())) {
        const couponDiscount = Math.round((totalDiscountedPrice * coupon.discountPercentage) / 100);
        cart.couponPrice = couponDiscount;
        cart.totalSellingPrice = totalDiscountedPrice - couponDiscount;
      } else {
        cart.couponCode = null;
        cart.couponPrice = 0;
        cart.totalSellingPrice = totalDiscountedPrice;
        await cart.save();
      }
    } else {
      cart.couponCode = null;
      cart.couponPrice = 0;
      cart.totalSellingPrice = totalDiscountedPrice;
    }

    return cart;
  }

  async applyCoupon(user, code) {
    const Coupon = require("../model/Coupon.js");
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) throw new Error("Cart not found");

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      throw new Error("Invalid Coupon Code");
    }

    if (!coupon.valid) {
      throw new Error("Coupon is no longer active");
    }

    if (coupon.expirationDate && new Date(coupon.expirationDate) < new Date()) {
      throw new Error("Coupon has expired");
    }

    // Evaluate raw totals before coupon to verify minimum purchase value
    const populatedCart = await this.findUserCart(user);
    let rawDiscountedPrice = 0;
    populatedCart.cartItems.forEach((item) => {
      rawDiscountedPrice += item.sellingPrice;
    });

    if (rawDiscountedPrice < coupon.minimumOrderValue) {
      throw new Error(`Minimum purchase of ₹${coupon.minimumOrderValue} required for this coupon`);
    }

    cart.couponCode = coupon.code;
    await cart.save();
    return await this.findUserCart(user);
  }

  async removeCoupon(user) {
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) throw new Error("Cart not found");

    cart.couponCode = null;
    cart.couponPrice = 0;
    await cart.save();
    return await this.findUserCart(user);
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
      return cartItem;
    }

    return isPresent;
  }
}

module.exports = new CartService();
