const db = require("../config/db");

const getPlans = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM plans");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

module.exports = { getPlans };
