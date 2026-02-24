const CartItemService = require("../service/CartItemService.js");
const CartService = require("../service/CartService.js");
const ProductService = require("../service/ProductService.js");


class CartController{

    async findUserCartHandler(req, res){
        try {
            const user = await req.user;
            const cart = await CartService.findUserCart(user);

            return res.status(200).json(cart);
        } catch (error) {
            console.log(`Error in findUserCartHandler controller : `, error.message);
            return res.status(500).json({error:error.message});
        }
    }

    async addItemToCart(req, res){
        try {
            const user = await req.user;
            const product = await ProductService.ProductService.findProductById(req.params.productId);
            
            const cartItem = await CartService.addCartItem(
                user,
                product,
                req.body.size,
                req.body.quantity
            )

            return res.status(202).json(cartItem);
        } catch (error) {
            console.log(`Error in addItemToCart controller : `, error.message);
            return res.status(500).json({error:error.message});
        }
    }

    async deleteCartItem(req, res){
        try {
            const user = await req.user;
            await CartItemService.removeCartItem(user._id,req.params.cartItemId);
            return res.status(202).json({message: "Item removed from cart"});
        } catch (error) {
            console.log(`Error in deleteCartItem controller : `, error.message);
            return res.status(500).json({error:error.message});
        }
    }

    async updateCartItemHandler(req, res){
        try {
        const cartItemId = req.params.cartItemId;
        const {quantity} = req.body;

        const user = await req.user;
        let updatedCartItem;
        if(quantity > 0){
            updatedCartItem = await CartItemService.updateCartItem(user._id,cartItemId,{quantity});
        }

        return res.status(202).json(updatedCartItem);
        } catch (error) {
            console.log(`Error in updateCartItemHandler controller : `, error.message);
            return res.status(500).json({error:error.message});
        }
    }
}

module.exports = new CartController();