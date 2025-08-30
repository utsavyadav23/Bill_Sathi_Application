const express = require("express");
const multer = require("multer");
const { addProduct, getProducts } = require("../controllers/productController");
const router = express.Router();

// Setup Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Route
router.post("/", upload.single("image"), addProduct);
router.get("/", getProducts);

module.exports = router;
