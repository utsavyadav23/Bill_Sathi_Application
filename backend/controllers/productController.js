const db = require("../config/db");
const addProduct = async (req, res) => {
  const { name, category, purchasePrice, sellingPrice, quantity, barcode } =
    req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !sellingPrice) {
    return res
      .status(400)
      .json({ error: "Name, Purchase Price & Selling Price are required." });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO products 
        (product_name, barcode, selling_price, purchase_price, category, stock, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        barcode,
        sellingPrice,
        purchasePrice || 0,
        category,
        quantity || 0,
        image,
      ]
    );

    const productId = result.insertId;

    // If stock > 0, also insert a purchase record
    if (quantity > 0 && purchasePrice > 0) {
      await db.query(
        `INSERT INTO purchases (product_id, category_id, quantity, purchase_price, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [productId, category, quantity, purchasePrice]
      );
    }

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

    // Fetch existing product before update
    const [oldProductRows] = await db.query(
      "SELECT stock, purchase_price, category FROM products WHERE id = ?",
      [id]
    );
    if (oldProductRows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    const oldProduct = oldProductRows[0];

    // Update product
    const query = `UPDATE products SET ${updates.join(", ")} WHERE id = ?`;
    values.push(id);
    const [result] = await db.query(query, values);

    // Log a purchase if stock increased or purchase_price changed
    if (stock && stock > oldProduct.stock) {
      const addedQty = stock - oldProduct.stock;
      const latestPrice = purchase_price || oldProduct.purchase_price;

      await db.query(
        `INSERT INTO purchases (product_id, category_id, quantity, purchase_price, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [id, category || oldProduct.category, addedQty, latestPrice]
      );
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

const productCount = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM products");
    res.json({ total: rows[0].total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

const bulkUpload = async (req, res) => {
  try {
    let products = [];
    if (req.body.products) {
      try {
        products = JSON.parse(req.body.products);
      } catch (err) {
        return res
          .status(400)
          .json({ success: false, error: "Invalid products JSON" });
      }
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No product data found" });
    }

    const [categories] = await db.query(
      "SELECT id, category_name FROM categories"
    );
    const categoryMap = {};
    categories.forEach((c) => {
      categoryMap[c.category_name.toLowerCase()] = c.id;
    });

    const uploadedImages = {};
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        uploadedImages[file.originalname] = file.filename;
      });
    }

    const formattedProducts = products.map((p) => {
      const categoryId =
        categoryMap[p.category?.toLowerCase()] || categoryMap["others"];

      let imagePath = "";
      if (p.image && uploadedImages[p.image]) {
        imagePath = `/uploads/${uploadedImages[p.image]}`;
      }

      return [
        p.product_name || "",
        p.barcode || "",
        Number(p.selling_price || 0),
        Number(p.purchase_price || 0),
        Number(p.stock || 0),
        categoryId,
        imagePath,
        new Date(),
      ];
    });

    const sql = `
      INSERT INTO products
      (product_name, barcode, selling_price, purchase_price, stock, category, image, created_at)
      VALUES ?
    `;
    const [result] = await db.query(sql, [formattedProducts]);

    if (result.insertId) {
      const insertedId = result.insertId;
      const insertedCount = result.affectedRows;
      const purchases = formattedProducts
        .map((p, i) => {
          const stock = p[4];
          const purchasePrice = p[3];
          const categoryId = p[5];
          if (stock > 0 && purchasePrice > 0) {
            return [
              insertedId + i,
              categoryId,
              stock,
              purchasePrice,
              new Date(),
            ];
          }
          return null;
        })
        .filter(Boolean);

      if (purchases.length > 0) {
        await db.query(
          `INSERT INTO purchases (product_id, category_id, quantity, purchase_price, created_at) VALUES ?`,
          [purchases]
        );
      }
    }
    res.json({
      success: true,
      message: "Products uploaded successfully",
      inserted: result.affectedRows,
    });
  } catch (err) {
    console.error("Bulk Upload Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  editProduct,
  deleteProduct,
  getProductById,
  productCount,
  bulkUpload,
};
