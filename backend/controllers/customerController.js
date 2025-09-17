const db = require("../config/db");

const getCustomers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM customers ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

const addCustomer = async (req, res) => {
  const { name, mobile } = req.body;
  if (!name || !mobile) {
    return res.status(400).json({ error: "Name and mobile are required" });
  }
  if (!/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ error: "Mobile must be 10 digits" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO customers (customer_name, customer_mobile_number) VALUES (?, ?)",
      [name, mobile]
    );
    res.json({ message: "Customer added successfully", id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.sqlMessage });
  }
};

const totalCustomers = async (req, res) => {
  try {
    const currentQuery = `
      SELECT COUNT(*) AS total
      FROM customers
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `;

    const prevQuery = `
      SELECT COUNT(*) AS last_total
      FROM customers
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH)
        AND YEAR(created_at) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH)
    `;

    const [rows] = await db.query(currentQuery);
    const [prevRows] = await db.query(prevQuery);

    const current = rows[0].total;
    const previous = prevRows[0].last_total;

    let growth = 0;
    if (previous > 0) {
      growth = ((current - previous) / previous) * 100;
    } else if (current > 0) {
      growth = 100;
    }

    res.json({
      total: current,
      last_total: previous,
      growth: Math.round(growth),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = { getCustomers, addCustomer, totalCustomers };
