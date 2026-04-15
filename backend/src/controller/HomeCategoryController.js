const HomeCategoryService = require("../service/HomeCategoryService");

class HomeCategoryController {
  async createHomeCategories(req, res) {
    try {
      const homeCategories = req.body;
      const categories =
        await HomeCategoryService.createHomeCategories(homeCategories);
      // const home = await HomeCategoryService.createHomePageData(categories);
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
}

module.exports = new HomeCategoryController();
