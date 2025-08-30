const db = require("../config/db");

const addProduct = async (req, res) => {
  const { name, category, purchasePrice, sellingPrice, quantity, barcode, image } = req.body;

  if (!name || !purchasePrice || !sellingPrice) {
    return res.status(400).json({ error: "Name, Purchase Price & Selling Price are required." });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO products (product_name, barcode, selling_price, purchase_price, category, stock, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, barcode, sellingPrice, purchasePrice, category, quantity, image]
    );
    res.json({ message: "Product added successfully!", productId: result.insertId });
  } catch (err) {
    console.error("Error inserting product:", err);
    res.status(500).json({ error: "Database error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = { addProduct, getProducts };
