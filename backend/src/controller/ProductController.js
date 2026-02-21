const ProductService = require("../service/ProductService");



class SellerProductController{

    async getProductBySellerId(req, res) {
        try {
            const seller = await req.seller;
            const products = await ProductService.getProductBySellerId(seller._id);
            res.status(200).json(products);
        } catch (error) {
            console.log(`Error in getProductBySellerId Controller :`,error.message)
            res.status(500).json({error: error.message})
        }
    }

    async createProduct(req, res) {
        try {
            // await createProductSchema.validate(req.body, {abortEarly: false});

            const seller = await req.seller;
            const product = await ProductService.createProduct(req.body, seller);
            return res.status(201).json(product);
        } catch (error) {
            console.log(`Error in createProduct Controller : `, error.message);
            
            // if(error instanceof Yup.validationError){
            //     return res.status(400).json({
            //         error: "Validation error",
            //         errors: error.errors,
            //         count: error.errors.length,
            //     });
            // }
            res.status(500).json({error: error.message})
        }
    }
    
    async deleteProduct(req, res){
        try {
            const product = await ProductService.deleteProduct(req.params.productId);
            return res.status(200).json({message: "Product Deleted Successfully"});
        } catch (error) {
            console.log(`Error in deleteProduct Controller : `, error.message);
            res.status(500).json({error: error.message});
        }
    }

    async updateProduct(req, res) {
        try {
            const product = await ProductService.updateProduct(req.params.productId, req.body);
            return res.status(200).json(product);
        } catch (error) {
            console.log(`Error in updateProduct Controller : `, error.message);
            res.status(500).json({error: error.message});
        }
    }

    async getProductById(req, res){
        try {
            const product = await ProductService.findProductById(req.params.productId);
            return res.status(200).json(product);
        } catch (error) {
            console.log(`Error in getProductById Controller : `, error.message);
            res.status(500).json({error: error.message});
        }
    }

    async searchProduct(req, res){
        try {
            const query = req.query.q;
            const products = await ProductService.searchProduct(query);
            return res.status(200).json(products);
        } catch (error) {
            console.log(`Error in searchProduct Controller : `, error.message);
            res.status(500).json({error: error.message});
        }
    }

    async getAllProducts(req, res){
        try {
            const products = await ProductService.getAllProducts(req.query);
            return res.status(200).json(products);
        } catch (error) {
            console.log(`Error in getAllProducts Controller : `, error.message);
            res.status(500).json({error: error.message});
        }
    }
}

module.exports = new SellerProductController();