const HomeCategoryService = require("../service/HomeCategoryService");


class HomeCategoryController{


    async createHomeCategories(req, res){
        try {
            const homeCategories = req.body;
            const categories = await HomeCategoryService.createHomeCategories(homeCategories);
            // const home = await HomeCategoryService.createHomePageData(categories);
            return res.status(202).json(home);
        } catch (error) {
            console.log(`Error in HomeCategory Controller : ${error}`);
            return res.status(500).json({error: error.message});
        }
    }
}


module.exports = new HommCategoryController();