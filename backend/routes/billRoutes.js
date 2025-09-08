const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  saveBill,
  uploadPDF,
  nextNumber,
  updateBill,
  getBillSums,
  getMonthSales,
} = require("../controllers/billController");

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/pdfs"),
  filename: (req, file, cb) => {
    // cb(null, Date.now() + path.extname(file.originalname));
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.post("/", saveBill);
router.post("/upload", upload.single("file"), uploadPDF);
router.get("/next-number", nextNumber);
router.get("/sums", getBillSums);
router.get("/month-sales", getMonthSales);
router.put("/:id", updateBill);

module.exports = router;
