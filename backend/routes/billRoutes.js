const express = require("express");
const { saveBill } = require("../controllers/billController");
const router = express.Router();
router.post("/", saveBill);
module.exports = router;
