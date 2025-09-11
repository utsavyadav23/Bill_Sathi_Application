const express = require("express");
const multer = require("multer");
const {
  addProduct,
  getProducts,
  editProduct,
  deleteProduct,
  getProductById,
  productCount,
  bulkUpload,
} = require("../controllers/productController");
const router = express.Router();

// Setup Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + safeName);
  },
});

const upload = multer({ storage: storage });

// Route
router.post("/", upload.single("image"), addProduct);
router.get("/", getProducts);
router.get("/count", productCount);
router.put("/:id", upload.single("image"), editProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getProductById);
router.post("/bulk-upload", upload.any(), bulkUpload);
module.exports = router;
