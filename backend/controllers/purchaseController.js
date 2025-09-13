const db = require("../config/db");

const monthlyPurchase = async (req, res) => {
  try {
    const query = `
      SELECT 
        IFNULL(SUM(total_amount), 0) AS month_purchases
      FROM purchases
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `;

    const [rows] = await db.query(query);

    res.json({ month_purchases: rows[0].month_purchases });
  } catch (err) {
    console.error("Error fetching monthly purchases:", err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = { monthlyPurchase };
