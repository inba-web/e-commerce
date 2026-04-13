const Deal = require("../model/Deal");
const HomeCategory = require("../model/HomeCategory");

class DealService{

    async getDeals(){
        return await Deal.find().populate({path:"category"})
    }

    async createDeals(deal){
        try {
            const category = await HomeCategory.findById(deal.category._id);

            const newDeal = new Deal({
                ...deal,
                category:category
            });
            const saveDeal = await newDeal.save();
            return await Deal.findById(saveDeal._id).populate({path:"Category"});
        } catch (error) {
            throw new Error(error.message);
        }
    }
}