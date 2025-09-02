const db = require("../config/db");

// Save a bill
const saveBill = async (req, res) => {
  try {
    const {
      customer_id,
      total,
      discount,
      tax,
      grand_total,
      payment_method,
      status,
      notes,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO bills 
   (customer_id, total, discount, tax, grand_total, payment_method, status, notes, created_at) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        customer_id,
        total,
        discount,
        tax,
        grand_total,
        payment_method,
        status,
        notes,
      ]
    );

    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Error inserting bill:", err);
    res.status(500).json({ success: false, error: "Failed to save bill" });
  }
};

module.exports = { saveBill };
