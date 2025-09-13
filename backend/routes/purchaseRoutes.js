const express = require("express");
const { monthlyPurchase } = require("../controllers/purchaseController");
const router = express.Router();

//Routes
router.get("/month-purchases", monthlyPurchase);
module.exports = router;
