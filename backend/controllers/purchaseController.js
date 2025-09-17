const db = require("../config/db");

const monthlyPurchase = async (req, res) => {
  try {
    const currentQuery = `
      SELECT IFNULL(SUM(total_amount), 0) AS month_purchases
      FROM purchases
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `;

    const prevQuery = `
      SELECT IFNULL(SUM(total_amount), 0) AS last_month_purchases
      FROM purchases
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH)
        AND YEAR(created_at) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH)
    `;

    const [rows] = await db.query(currentQuery);
    const [prevRows] = await db.query(prevQuery);

    const current = rows[0].month_purchases;
    const previous = prevRows[0].last_month_purchases;

    let growth = 0;
    if (previous > 0) {
      growth = ((current - previous) / previous) * 100;
    } else if (current > 0) {
      growth = 100;
    }

    res.json({
      month_purchases: current,
      last_month_purchases: previous,
      growth: Math.round(growth),
    });
  } catch (err) {
    console.error("Error fetching monthly purchases:", err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = { monthlyPurchase };
