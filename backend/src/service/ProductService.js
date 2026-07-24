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
        color: req.color,
        quantity: req.quantity, 
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
      if (updatedProductedData.mrpPrice && updatedProductedData.sellingPrice) {
        updatedProductedData.discountPercent = calculateDiscountPercentage(
          updatedProductedData.mrpPrice,
          updatedProductedData.sellingPrice
        );
      }

      if (updatedProductedData.category) {
        const category1 = await this.createOrGetCategory(updatedProductedData.category, 1);
        const category2 = await this.createOrGetCategory(
          updatedProductedData.category2 || "clothing",
          2,
          category1._id
        );
        const category3 = await this.createOrGetCategory(
          updatedProductedData.category3 || "ethnic-wear",
          3,
          category2._id
        );
        updatedProductedData.category = category3._id;
      }

      delete updatedProductedData.category2;
      delete updatedProductedData.category3;

      const product = await Product.findByIdAndUpdate(
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
      const product = await Product.findById(productId).populate("category");
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
      const Category = require("../model/Category.js");
      const categories = await Category.find({ name: new RegExp(query, "i") });
      const categoryIds = categories.map(c => c._id);

      const products = await Product.find({
        $or: [
          { title: new RegExp(query, "i") },
          { description: new RegExp(query, "i") },
          { category: { $in: categoryIds } }
        ]
      });
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

      let categoryIds = [category._id];
      if (category.level === 0) {
        const lvl1Categories = await Category.find({ parentCategory: category._id });
        const lvl1Ids = lvl1Categories.map(c => c._id);
        const lvl2Categories = await Category.find({ parentCategory: { $in: lvl1Ids } });
        const lvl2Ids = lvl2Categories.map(c => c._id);
        const lvl3Categories = await Category.find({ parentCategory: { $in: lvl2Ids } });
        categoryIds = lvl3Categories.map(c => c._id);
      } else if (category.level === 1) {
        const lvl2Categories = await Category.find({ parentCategory: category._id });
        const lvl2Ids = lvl2Categories.map(c => c._id);
        const lvl3Categories = await Category.find({ parentCategory: { $in: lvl2Ids } });
        categoryIds = lvl3Categories.map(c => c._id);
      } else if (category.level === 2) {
        const lvl3Categories = await Category.find({ parentCategory: category._id });
        categoryIds = lvl3Categories.map(c => c._id);
      }

      filterQuery.category = { $in: categoryIds };
    }

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

    const page = parseInt(req.pageNumber) || 0;
    const limit = 10;

    const products = await Product.find(filterQuery)
      .sort(sortQuery)
      .skip(page * limit)
      .limit(limit);

    const totalElement = await Product.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalElement / 10);

    const res = {
      content: products,
      totalPages: totalPages,
      totalElement: totalElement,
    };

    return res;
  }
}

module.exports = {
  ProductService: new ProductService(),
  calculateDiscountPercentage
};