const db = require("../config/db");

// Save a bill
const saveBill = async (req, res) => {
  try {
    const [result] = await db.query(
      `INSERT INTO bills 
      (customer_id, total, discount, tax, grand_total, status, payment_method, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.customer_id,
        req.body.total,
        req.body.discount || 0,
        req.body.tax || 0,
        req.body.grand_total,
        req.body.status || "due",
        req.body.payment_method || "CASH",
        req.body.notes || null,
      ]
    );

    const formattedBillNumber = `BILL-${String(result.insertId).padStart(
      4,
      "0"
    )}`;

    res.json({
      success: true,
      id: result.insertId,
      billNumber: formattedBillNumber,
    });
  } catch (err) {
    console.error("Save Bill Error:", err.sqlMessage || err.message);
    res.status(500).json({
      success: false,
      error: err.sqlMessage || err.message,
    });
  }
};

// Upload API
const uploadPDF = async (req, res) => {
  try {
    const { bill_id } = req.body;
    if (!bill_id) {
      return res
        .status(400)
        .json({ success: false, error: "bill_id is required" });
    }
    const filePath = `/uploads/pdfs/${req.file.filename}`;
    const [result] = await db.query(
      "INSERT INTO bill_pdfs (bill_id, file_path) VALUES (?, ?)",
      [bill_id, filePath]
    );

    res.json({ success: true, insertedId: result.insertId, filePath });
  } catch (err) {
    console.error("Upload PDF Error:", err.sqlMessage || err.message);
    res.status(500).json({ success: false, error: "Failed to save PDF" });
  }
};

const nextNumber = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT COUNT(*) as count FROM bills");
    const count = rows[0].count + 1;
    const billNumber = `BILL-${String(count).padStart(4, "0")}`;
    res.json({ billNumber });
  } catch (err) {
    res.status(500).json({ error: "Error generating bill number" });
  }
};

const updateBill = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_id,
      total,
      discount,
      tax,
      grand_total,
      status,
      payment_method,
      notes,
    } = req.body;

    await db.query(
      "UPDATE bills SET customer_id=?, total=?, discount=?, tax=?, grand_total=?, status=?, payment_method=?, notes=? WHERE bill_number=?",
      [
        customer_id,
        total,
        discount,
        tax,
        grand_total,
        status,
        payment_method,
        notes,
        id,
      ]
    );
    res.json({ success: true, message: "Bill updated successfully" });
  } catch (err) {
    console.error(" Error updating bill:", err);
    res.status(500).json({ success: false, error: "Failed to update bill" });
  }
};

const getBillSums = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        SUM(grand_total) AS total_sales,
        SUM(CASE WHEN status = 'Due' THEN grand_total ELSE 0 END) AS total_due
      FROM bills
    `);

    res.json({
      total_sales: rows[0].total_sales || 0,
      total_due: rows[0].total_due || 0,
    });
  } catch (err) {
    console.error("Error fetching bill sums:", err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = { saveBill, uploadPDF, nextNumber, updateBill, getBillSums };
