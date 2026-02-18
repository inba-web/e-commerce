const Category = require("../model/Category.js");
const Product = require("../model/Product.js");

const calculateDiscountPercentage = (mrpPrice, sellingPrice) => {
  if (mrpPrice <= 0) {
    throw new Error("MRP Price should be greater than zero.");
  }

  const discount = mrpPrice - sellingPrice;

  return Math.round((discount / mrpPrice) * 100);
};

class ProductService {
  async createProduct(req, seller) {
    try {
      const discountPercent = calculateDiscountPercentage(
        req.mrpPrice,
        req.sellingPrice,
      );

      const category1 = await this.createOrGetCategory(req.category, 1);
      const category2 = await this.createOrGetCategory(
        req.category2,
        2,
        category1._id,
      );
      const category3 = await this.createOrGetCategory(
        req.category3,
        3,
        category2._id,
      );

      const product = new Product({
        title: req.title,
        description: req.description,
        images: req.images,
        mrpPrice: req.mrpPrice,
        sellingPrice: req.sellingPrice,
        discountPercent,
        size: req.size,
        seller: seller._id,
        category: category3._id,
      });

      return await product.save();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createOrGetCategory(categoryId, level, parentId = null) {
    let category = await Category.findOne({ categoryId });

    if (!category) {
      category = new Category({
        categoryId,
        level,
        parentCategory: parentId,
      });
      category = await category.save();
    }
    return category;
  }

  async deleteProduct(productId) {
    try {
      await Product.findByIdAndDelete(productId);
      return "Product Deleted Successfully";
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(productId, updatedProductedData) {
    try {
      const product = await Product.findAndUpdate(
        productId,
        updatedProductedData,
        { new: true },
      );
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  
}
