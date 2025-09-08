const express = require("express");
const {
  getCustomers,
  addCustomer,
  totalCustomers,
} = require("../controllers/customerController");
const router = express.Router();

router.get("/", getCustomers);
router.get("/count", totalCustomers);
router.post("/add", addCustomer);

module.exports = router;
