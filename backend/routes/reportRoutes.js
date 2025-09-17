const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  topSellingItem,
  revenueByCategory,
  salesVsPurchases,
  uploadReport,
} = require("../controllers/reportController");
const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/reports"),
  filename: (req, file, cb) => {
    // cb(null, Date.now() + path.extname(file.originalname));
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
//Routes
router.get("/top-selling", topSellingItem);
router.get("/revenue-by-category", revenueByCategory);
router.get("/sales-vs-purchases", salesVsPurchases);
router.post("/upload", upload.single("file"), uploadReport);

module.exports = router;
