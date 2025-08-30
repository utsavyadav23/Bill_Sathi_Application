const db = require("../config/db");
const addProduct = async (req, res) => {
  const { name, category, purchasePrice, sellingPrice, quantity, barcode } =
    req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !purchasePrice || !sellingPrice) {
    return res
      .status(400)
      .json({ error: "Name, Purchase Price & Selling Price are required." });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO products 
        (product_name, barcode, selling_price, purchase_price, category, stock, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, barcode, sellingPrice, purchasePrice, category, quantity, image]
    );

    res.json({
      message: "Product added successfully!",
      productId: result.insertId,
      image: image,
    });
  } catch (err) {
    console.error(" Error inserting product:", err);
    res.status(500).json({ error: "Database error" });
  }
};

const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        products.id,
        products.product_name,
        products.barcode,
        products.stock,
        products.purchase_price,
        products.selling_price,
        categories.category_name AS category
      FROM products
      JOIN categories ON products.category = categories.id
      ORDER BY products.id DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Query error" });
  }
};

module.exports = { addProduct, getProducts };
