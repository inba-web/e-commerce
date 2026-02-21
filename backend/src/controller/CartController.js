const CartService = require("../service/CartService");
const ProductService = require("../service/ProductService");


class CartController{

    async findUserCartHandler(req, res){
        try {
            const user = await req.user;
            const cart = await CarrtService.findUserCart(user);

            return res.status(200).json(cart);
        } catch (error) {
            console.log(`Error in findUserCartHandler controller : `, error.message);
            return res.status(500).json({error:error.message});
        }
    }

    async addItemToCart(req, res){
        try {
            const user = await req.user;
            const product = await ProductService.findProductById(req.body.productId);
            
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
}