const express = require("express")
const HomeCategoryController = require("../controller/HomeCategoryController")
const router = express.Router()

router.post("/categories", HomeCategoryController.createHomeCategories);
router.get("/home-category", HomeCategoryController.getHomeCategory);
router.put("/categories/:id", HomeCategoryController.updateHomeCategory);
router.get("/", HomeCategoryController.getHomePageData);



module.exports = router;