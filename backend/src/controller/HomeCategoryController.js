const HomeService = require("../service/HomeService");
const HomeCategoryService = require("../service/HomeCategoryService");

class HomeCategoryController {

  async createHomeCategories(req, res) {
    try {
      const homeCategories = req.body;
      const categories =
        await HomeCategoryService.createCategories(homeCategories);
      const home = await HomeService.createHomePageData(categories);
      return res.status(202).json(home);
    } catch (error) {
      console.log(`Error in HomeCategory Controller : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }

  async getHomeCategory(req, res) {
    try {
      const categories = await HomeCategoryService.getAllHomeCategories();
      return res.status(200).json(categories);
    } catch (error) {
      console.log(`Error in getHomeCategory Controller : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }

  async getHomePageData(req, res) {
    try {
      const allCategories = await HomeCategoryService.getAllHomeCategories();
      const homeData = await HomeService.createHomePageData(allCategories);
      return res.status(200).json(homeData);
    } catch (error) {
      console.log(`Error in getHomePageData Controller : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }

  async updateHomeCategory(req, res) {
    try {
      const category = req.body;
      const id = req.params.id;
      const updatedCategory = await HomeCategoryService.updateHomeCategory(
        category,
        id,
      );
      return res.status(200).json(updatedCategory);
    } catch (error) {
      console.log(`Error in updateHomeCategory Controller : ${error}`);
      return res.status(500).json({ error: error.message });
    }
  }

  async uploadCategoryImg(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      const cloudinary = require("../utils/cloudinary");
      
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "inbamart_categories" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ error: error.message });
          }
          return res.status(200).json({ url: result.secure_url });
        }
      );

      uploadStream.end(req.file.buffer);
    } catch (error) {
      console.error("Error in uploadCategoryImg controller:", error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new HomeCategoryController();
