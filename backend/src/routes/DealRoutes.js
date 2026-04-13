const express = require("express");
const DealController = require("../controller/DealController");
const router = express.Router();

router.get('/', DealController.getAllDeals);
router.post('/', DealController.createDeals);
router.patch('/:id', DealController.updateDeal);
router.delete('/:id', DealController.deleteDeal);

module.exports = router;