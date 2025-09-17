const db = require("../config/db");

const nextNumber = async (req, res) => {
  try {
    const [[row]] = await db.query(
      "SELECT MAX(bill_number) as lastId FROM bills"
    );
    const sequenceId = (row.lastId || 0) + 1;
    const billNumber = `BILL-${String(sequenceId).padStart(4, "0")}`;
    res.json({ billNumber, sequenceId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating preview bill number" });
  }
};
//Save Bill
const saveBill = async (req, res) => {
  const conn = await db.getConnection();
  try {
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

    await conn.beginTransaction();
    const [result] = await conn.query(
      `INSERT INTO bills 
      (customer_id, total, discount, tax, grand_total, status, payment_method, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        total,
        discount || 0,
        tax || 0,
        grand_total,
        status || "due",
        payment_method || "CASH",
        notes || null,
      ]
    );

    const formattedBillNumber = `BILL-${String(result.insertId).padStart(
      4,
      "0"
    )}`;

    const billId = result.insertId;
    await conn.query(
      `UPDATE bill_items SET bill_id=? WHERE customer_id=? AND bill_id IS NULL`,
      [billId, customer_id]
    );

    await conn.commit();

    res.json({
      success: true,
      id: billId,
      billNumber: formattedBillNumber,
    });
  } catch (err) {
    await conn.rollback();
    console.error("Save Bill Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
};

const cancelBill = async (req, res) => {
  const conn = await db.getConnection();
  try {
    const bill_id = req.params.sequenceId || null;
    const customer_id = req.query.customer_id || null;

    await conn.beginTransaction();

    if (bill_id) {
      // Cancel saved bill
      const [items] = await conn.query(
        "SELECT product_id, quantity FROM bill_items WHERE bill_id=?",
        [bill_id]
      );

      if (items.length > 0) {
        for (const item of items) {
          await conn.query("UPDATE products SET stock=stock+? WHERE id=?", [
            item.quantity,
            item.product_id,
          ]);
        }

        await conn.query("DELETE FROM bill_items WHERE bill_id=?", [bill_id]);
      }

      await conn.query("DELETE FROM bills WHERE bill_number=?", [bill_id]);

      await conn.commit();
      return res.json({
        success: true,
        type: "saved",
        message: "Saved bill cancelled successfully",
      });
    }

    if (customer_id) {
      // Cancel draft bill
      const [draftItems] = await conn.query(
        "SELECT product_id, quantity FROM bill_items WHERE customer_id=? AND bill_id IS NULL",
        [customer_id]
      );

      if (draftItems.length > 0) {
        for (const item of draftItems) {
          await conn.query("UPDATE products SET stock=stock+? WHERE id=?", [
            item.quantity,
            item.product_id,
          ]);
        }

        await conn.query(
          "DELETE FROM bill_items WHERE customer_id=? AND bill_id IS NULL",
          [customer_id]
        );
      }

      await conn.commit();
      return res.json({
        success: true,
        type: "draft",
        message: "Draft bill cancelled successfully",
      });
    }

    await conn.rollback();
    return res
      .status(400)
      .json({ success: false, error: "bill_id or customer_id required" });
  } catch (err) {
    await conn.rollback();
    console.error("Error cancelling bill:", err.message);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    conn.release();
  }
};

const uploadPDF = async (req, res) => {
  try {
    const { bill_id } = req.body;
    if (!bill_id)
      return res
        .status(400)
        .json({ success: false, error: "bill_id is required" });

    const filePath = `/uploads/pdfs/${req.file.filename}`;
    const [result] = await db.query(
      "INSERT INTO bill_pdfs (bill_id, file_path) VALUES (?, ?)",
      [bill_id, filePath]
    );

    res.json({ success: true, insertedId: result.insertId, filePath });
  } catch (err) {
    console.error("Upload PDF Error:", err.message);
    res.status(500).json({ success: false, error: "Failed to save PDF" });
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
    console.error("Error updating bill:", err.message);
    res.status(500).json({ success: false, error: "Failed to update bill" });
  }
};

const getBillSums = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        (SELECT SUM(grand_total) FROM bills WHERE DATE(created_at) = CURDATE()) AS today_sales,
        (SELECT SUM(grand_total) FROM bills WHERE status = 'Due') AS total_due
    `);

    res.json({
      today_sales: rows[0].today_sales || 0,
      total_due: rows[0].total_due || 0,
    });
  } catch (err) {
    console.error("Error fetching bill sums:", err.message);
    res.status(500).json({ error: "Database error" });
  }
};

const getMonthSales = async (req, res) => {
  try {
    const currentQuery = `
      SELECT IFNULL(SUM(grand_total), 0) AS month_sales
      FROM bills
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `;

    const prevQuery = `
      SELECT IFNULL(SUM(grand_total), 0) AS last_month_sales
      FROM bills
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH)
        AND YEAR(created_at) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH)
    `;

    const [rows] = await db.query(currentQuery);
    const [prevRows] = await db.query(prevQuery);

    const current = rows[0].month_sales;
    const previous = prevRows[0].last_month_sales;

    let growth = 0;
    if (previous > 0) {
      growth = ((current - previous) / previous) * 100;
    } else if (current > 0) {
      growth = 100;
    }

    res.json({
      month_sales: current,
      last_month_sales: previous,
      growth: Math.round(growth),
    });
  } catch (error) {
    console.error("Error fetching bill sums:", error);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = {
  saveBill,
  uploadPDF,
  nextNumber,
  updateBill,
  getBillSums,
  getMonthSales,
  cancelBill,
};
