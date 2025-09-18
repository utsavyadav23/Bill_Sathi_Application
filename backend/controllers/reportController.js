const db = require("../config/db");

const topSellingItem = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.product_id, p.product_name, SUM(s.quantity) as total_sold
       FROM sales s
       JOIN products p ON s.product_id = p.id
       WHERE MONTH(s.created_at) = MONTH(CURRENT_DATE())
         AND YEAR(s.created_at) = YEAR(CURRENT_DATE())
       GROUP BY s.product_id
       ORDER BY total_sold DESC
       LIMIT 1`
    );

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json({ product_name: "No Sales", total_sold: 0 });
    }
  } catch (error) {
    console.error("Error fetching top selling item:", error);
    res.status(500).json({ error: "Failed to fetch top selling item" });
  }
};

const revenueByCategory = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.category_name, SUM(s.total_amount) AS revenue
       FROM sales s
       JOIN categories c ON s.category_id = c.id
       WHERE MONTH(s.created_at) = MONTH(CURRENT_DATE())
         AND YEAR(s.created_at) = YEAR(CURRENT_DATE())
       GROUP BY c.id, c.category_name
       ORDER BY revenue DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching revenue by category:", error);
    res.status(500).json({ error: "Failed to fetch revenue by category" });
  }
};

const salesVsPurchases = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
          DATE_FORMAT(created_at, '%Y-%m') AS month,
          SUM(grand_total) AS total_sales,
          0 AS total_purchases
       FROM bills
       WHERE YEAR(created_at) = YEAR(CURDATE())
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       UNION ALL
       SELECT 
          DATE_FORMAT(created_at, '%Y-%m') AS month,
          0 AS total_sales,
          SUM(total_amount) AS total_purchases
       FROM purchases
       WHERE YEAR(created_at) = YEAR(CURDATE())
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')`
    );

    const map = {};
    rows.forEach((row) => {
      if (!map[row.month]) {
        map[row.month] = { month: row.month, Sales: 0, Purchases: 0 };
      }
      map[row.month].Sales += parseFloat(row.total_sales || 0);
      map[row.month].Purchases += parseFloat(row.total_purchases || 0);
    });

    const merged = Object.values(map).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    res.json(merged);
  } catch (error) {
    console.error("Error fetching sales vs purchases:", error);
    res.status(500).json({ error: "Failed to fetch sales vs purchases" });
  }
};

const uploadReport = async (req, res) => {
  try {
    const { month } = req.body;
    if (!req.file || !month) {
      return res
        .status(400)
        .json({ success: false, error: "file and month required" });
    }

    const filePath = `/uploads/reports/${req.file.filename}`;
    const [result] = await db.query(
      "INSERT INTO reports (month, file_path) VALUES (?, ?)",
      [month, filePath]
    );

    res.json({ success: true, insertedId: result.insertId, filePath });
  } catch (err) {
    console.error("Upload Report Error:", err.message);
    res.status(500).json({ success: false, error: "Failed to save report" });
  }
};

module.exports = {
  topSellingItem,
  revenueByCategory,
  salesVsPurchases,
  uploadReport,
};
