const db = require("../config/db");
const showBills = async (req, res) => {
  try {
    const [rows] =
      await db.query(`SELECT b.bill_number,b.created_at,c.customer_name,c.customer_mobile_number,b.grand_total,b.status,b.payment_method
       FROM bills b JOIN customers c ON b.customer_id = c.id ORDER BY created_at DESC`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};


// GET latest PDF for a bill
  const latestPDF = async (req, res) => {
  const { billId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM bill_pdfs WHERE bill_id = ? ORDER BY created_at DESC LIMIT 1",
      [billId]
    );

    if (!rows.length) {
      return res.json({ success: false, message: "No PDF found" });
    }

    res.json({
      success: true,
      filePath: rows[0].file_path, 
      fileUrl: rows[0].file_url || null, 
    });
  } catch (err) {
    console.error("Error fetching latest PDF:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { showBills , latestPDF};
