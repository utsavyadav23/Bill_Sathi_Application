const express = require("express");
const {
  showBills,
  latestPDF,
} = require("../controllers/billsAndDuesController");
const router = express.Router();

router.get("/", showBills);
router.get("/:billId/latest", latestPDF);

module.exports = router;
