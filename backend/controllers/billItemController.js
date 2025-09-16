const db = require("../config/db");

// ADD bill item + reduce stock + insert into sales
const addBillItem = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { customer_id, product_id, quantity, unit_price } = req.body;

    const custId = parseInt(customer_id) || null;
    const prodId = parseInt(product_id) || 0;
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(unit_price) || 0;
    const total = qty * price;

    await conn.beginTransaction();

    const [[prodRow]] = await conn.query(
      "SELECT category_id FROM  products WHERE id = ?",
      [prodId]
    );

    if (!prodRow) throw new Error("Product not found");
    const catId = prodRow.category_id;

    // Insert bill item
    const [result] = await conn.query(
      "INSERT INTO bill_items (customer_id, product_id, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?)",
      [custId, prodId, qty, price, total]
    );

    // Deduct stock
    const [updateRes] = await conn.query(
      "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
      [qty, prodId, qty]
    );
    if (updateRes.affectedRows === 0) throw new Error("Insufficient stock");

    // Insert into sales
    await conn.query(
      "INSERT INTO sales (bill_items_id, product_id, category_id, quantity, selling_price) VALUES (?, ?, ?, ?, ?)",
      [result.insertId, prodId, catId, qty, price]
    );

    await conn.commit();
    res.json({
      success: true,
      message: "Bill item added, stock updated & sales recorded",
      id: result.insertId,
      customer_id: custId,
      product_id: prodId,
      category_id: catId,
      quantity: qty,
      unit_price: price,
      total,
    });
  } catch (err) {
    await conn.rollback();
    console.error("Error adding bill item:", err.message);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
};

// EDIT bill item + adjust stock + update sales
const editBillItem = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { id } = req.params;
    let { quantity, unit_price } = req.body;

    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(unit_price) || 0;
    const total = qty * price;

    await conn.beginTransaction();

    // Get old item
    const [rows] = await conn.query(
      "SELECT product_id, quantity FROM bill_items WHERE id=?",
      [id]
    );
    if (!rows.length) throw new Error("Item not found");

    const oldQty = rows[0].quantity;
    const productId = rows[0].product_id;
    const diff = qty - oldQty;

    // Update bill_items
    await conn.query(
      "UPDATE bill_items SET quantity=?, unit_price=?, total=? WHERE id=?",
      [qty, price, total, id]
    );

    // Adjust stock
    if (diff !== 0) {
      const [updateRes] = await conn.query(
        "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
        [diff, productId, diff]
      );
      if (updateRes.affectedRows === 0) {
        throw new Error("Insufficient stock for update");
      }
    }

    // Update sales entry
    await conn.query(
      "UPDATE sales SET quantity=?, selling_price=? WHERE bill_items_id=?",
      [qty, price, id]
    );

    await conn.commit();
    res.json({
      success: true,
      message: "Bill item updated, stock adjusted & sales updated",
      total,
    });
  } catch (err) {
    await conn.rollback();
    console.error("Error editing bill item:", err.message);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
};

// DELETE bill item + restore stock + delete sales
const deleteBillItem = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { id } = req.params;

    await conn.beginTransaction();

    // Get item details
    const [rows] = await conn.query(
      "SELECT product_id, quantity FROM bill_items WHERE id=?",
      [id]
    );
    if (!rows.length) throw new Error("Item not found");

    const { product_id, quantity } = rows[0];

    // Delete bill_item
    await conn.query("DELETE FROM bill_items WHERE id = ?", [id]);

    // Restore stock
    await conn.query("UPDATE products SET stock = stock + ? WHERE id = ?", [
      quantity,
      product_id,
    ]);

    // Delete from sales
    await conn.query("DELETE FROM sales WHERE bill_items_id = ?", [id]);

    await conn.commit();
    res.json({
      success: true,
      message: "Bill item deleted, stock restored & sales removed",
    });
  } catch (err) {
    await conn.rollback();
    console.error("Error deleting bill item:", err.message);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
};

module.exports = {
  addBillItem,
  editBillItem,
  deleteBillItem,
};
