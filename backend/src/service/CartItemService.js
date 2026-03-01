const CartItem = require("../model/CartItem");

class CartItemService {

    async updateCartItem(userId, cartItemId, cartItemData) {
        const cartItem = await this.findCartItemById(cartItemId);

        if (cartItem.userId.toString() === userId.toString()) {
            const updated = {
                quantity: cartItemData.quantity,
                mrpPrice: cartItemData.quantity * cartItem.product.mrpPrice,
                sellingPrice: cartItemData.quantity * cartItem.product.sellingPrice
            }

            return await CartItem.findByIdAndUpdate(cartItemId, updated, {
                new: true
            }).populate("product");
        }
        else {
            throw new Error("Unauthorized access");
        }
    }

    async removeCartItem(userId, cartItemId) {
        const cartItem = await this.findCartItemById(cartItemId);

        if (cartItem.userId.toString() === userId.toString()) {
            await CartItem.deleteOne({ _id: cartItem._id })
        }
        else {
            throw new Error("Unauthorized access");
        }
    }

    async findCartItemById(cartItemId) {
        const cartItem = await CartItem.findById(cartItemId).populate("product");

        if (!cartItem) {
            throw new Error("cart item not found");
        }

        return cartItem;
    }
}

module.exports = new CartItemService();