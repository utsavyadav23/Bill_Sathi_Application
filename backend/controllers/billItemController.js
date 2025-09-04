const db = require("../config/db");

// DELETE bill item
const deleteBillItem = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM bill_items WHERE id = ?", [id]);
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to delete item" });
  }
};

// UPDATE bill item
const editBillItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, unitPrice } = req.body;
    const total = quantity * unitPrice;

    await db.query(
      "UPDATE bill_items SET  quantity=?, unit_price=?, total=? WHERE id=?",
      [quantity, unitPrice, total, id]
    );

    res.json({ success: true, message: "Item updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to update item" });
  }
};

// Add bill item
const addBillItem = async (req, res) => {
  try {
    const { customer_id, product_id, quantity, unit_price } = req.body;
    const total = quantity * unit_price;

    const [result] = await db.query(
      "INSERT INTO bill_items (customer_id, product_id, quantity, unit_price, total) VALUES (?, ?, ?, ?, ?)",
      [customer_id, product_id, quantity, unit_price, total]
    );

    res.json({
      success: true,
      message: "Bill item added successfully",
      id: result.insertId,
      total,
    });
  } catch (err) {
    console.error("Error adding bill item:", err);
    res.status(500).json({ success: false, error: "Failed to add bill item" });
  }
};

module.exports = {
  addBillItem,
  editBillItem,
  deleteBillItem,
};
