const express = require("express");
const {
  addBillItem,
  editBillItem,
  deleteBillItem,
} = require("../controllers/billItemController");
const router = express.Router();

router.post("/", addBillItem);
router.put("/:id", editBillItem);
router.delete("/:id", deleteBillItem);
module.exports = router;
