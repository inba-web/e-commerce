const HomeCategory = require("../model/HomeCategory");

class HomeCategoryService{

    async getAllHomeCategories(){
        return await HomeCategory.find();
    }

    async createHomeCategory(homeCategory){
        return await HomeCategory.create(homeCategory);
    } 

    async createCategories(homeCategories){
        const existingCategories = await HomeCategory.find();

        if(existingCategories.length === 0){
            return await HomeCategory.insertMany(homeCategories);
        }

        return existingCategories;
    }

    async updateHomeCategory(category, id){
        const existingCategories = await HomeCategory.findById(id);

        if(!existingCategories){
            throw new Error("Category not foud")
        }

        return await HomeCategory.findByIdAndUpdate(existingCategories._id,category,{new:true});
    }
}

module.export = new HomeCategoryService();