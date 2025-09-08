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
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM customers");
    res.json({ total: rows[0].total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = { getCustomers, addCustomer, totalCustomers };
