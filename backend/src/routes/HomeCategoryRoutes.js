const express = require("express")
const HomeCategoryController = require("../controller/HomeCategoryController")
const router = express.Router()

router.post("/categories", HomeCategoryController.createHomeCategories);
router.get("home-category", HomeCategoryController.getHomeCategory);
router.put("/categories/:id", HomeCategoryController.updateHomeCategory);



module.exports = router;