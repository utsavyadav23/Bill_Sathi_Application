const express = require("express");
const { getCustomers, addCustomer } = require("../controllers/customerController");
const router = express.Router();

router.get("/", getCustomers);
router.post("/add", addCustomer);

module.exports = router;
