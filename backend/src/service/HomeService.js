const HomeCategorySection = require("../domain/HomeCategorySection");
const DealService = require("./DealService");

class HomeService{

    async createHomePageData(allCategories){

        const gridCategories = allCategories.filter(category => category.section === HomeCategorySection.GRID);
        const electricCategories = allCategories.filter(category => category.section === HomeCategorySection.ELECTRIC_CATEGORIES);
        const shopByCategories = allCategories.filter(category => category.section === HomeCategorySection.SHOP_BY_CATEGORIES);
        const dealCategories = allCategories.filter(category => category.section === HomeCategorySection.DEALS);

        const deals = await DealService.getDeals();
        
        const home = {
            grid:"",
            shopByCategories:[],
            electricCategories:[],
            deals:[],
            dealCategories:[],
        }
    }
}