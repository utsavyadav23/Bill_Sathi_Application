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

// Update product
const editProduct = async (req, res) => {
  const { id } = req.params;
  const {
    product_name,
    category,
    purchase_price,
    selling_price,
    stock,
    barcode,
  } = req.body;

  const updates = [];
  const values = [];

  if (product_name !== undefined && product_name !== "") {
    updates.push("product_name = ?");
    values.push(product_name);
  }
  if (category !== undefined && category !== "") {
    updates.push("category = ?");
    values.push(category);
  }
  if (purchase_price !== undefined && purchase_price !== "") {
    updates.push("purchase_price = ?");
    values.push(purchase_price);
  }
  if (selling_price !== undefined && selling_price !== "") {
    updates.push("selling_price = ?");
    values.push(selling_price);
  }
  if (stock !== undefined && stock !== "") {
    updates.push("stock = ?");
    values.push(stock);
  }
  if (barcode !== undefined && barcode !== "") {
    updates.push("barcode = ?");
    values.push(barcode);
  }

  if (req.file) {
    updates.push("image = ?");
    values.push(req.file.filename);
  }

  try {
    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    const query = `UPDATE products SET ${updates.join(", ")} WHERE id = ?`;
    values.push(id);

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: "Error updating product" });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        products.id,
        products.product_name,
        products.barcode,
        products.stock,
        products.purchase_price,
        products.selling_price,
        products.category AS category_id, 
        products.image, 
        categories.category_name 
      FROM products
      JOIN categories ON products.category = categories.id
       WHERE products.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    const product = rows[0];
    product.image = product.image
      ? `http://localhost:5000/uploads/${product.image}`
      : null;

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting product" });
  }
};

module.exports = {
  addProduct,
  getProducts,
  editProduct,
  deleteProduct,
  getProductById,
};
