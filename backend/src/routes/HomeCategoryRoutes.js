const express = require("express")
const HomeCategoryController = require("../controller/HomeCategoryController")
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()

router.post("/categories", HomeCategoryController.createHomeCategories);
router.get("/home-category", HomeCategoryController.getHomeCategory);
router.put("/categories/:id", HomeCategoryController.updateHomeCategory);
router.post("/upload", upload.single("image"), HomeCategoryController.uploadCategoryImg);
router.get("/", HomeCategoryController.getHomePageData);

module.exports = router;