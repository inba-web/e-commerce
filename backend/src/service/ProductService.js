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

  async findProductById(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async searchProduct(query) {
    try {
      const products = await Product.find({ title: new RegExp(query, "i") });
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getProductBySellerId(sellerId) {
    try {
      return await Product.find({ seller: sellerId });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAllProducts(req) {
    const filterQuery = {};

    if (req.category) {
      const category = await Category.findOne({ categoryId: req.category });

      if (!category) {
        return {
          content: [],
          totalPages: 0,
          totalElement: 0,
        };
      }

      filterQuery.category = category._id.toString();

      if (req.color) {
        filterQuery.color = req.color;
      }

      if (req.minPrice && req.maxPrice) {
        filterQuery.sellingPrice = { $gte: req.minPrice, $lte: req.maxPrice };
      }

      if (req.minDiscount) {
        filterQuery.discountPercent = { $gte: req.minDiscount };
      }

      if (req.size) {
        filterQuery.size = req.size;
      }

      let sortQuery = {};

      if (req.sort === "price_low") {
        sortQuery.sellingPrice = 1;
      } else if (req.sort === "price_high") {
        sortQuery.sellingPrice = -1;
      }

      const products = Product.find(filterQuery)
        .sort(sortQuery)
        .skip(req.pageNumber * 10)
        .limit(10);

      const totalElement = await Product.countDocuments(filterQuery);
      const totalPages = Math.ceil(totalElement/10);

      const res = {
        content:products,
        totalPages:totalPages,
        totalElement:totalElement
      }

      return res;
    }
  }
}

module.exports = new ProductService();
