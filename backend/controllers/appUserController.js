const db = require("../config/db");

const addAppUser = async (req, res) => {
  try {
    const {
      store_name,
      gst_number,
      app_user_email,
      app_user_mobile_number,
      currency,
      language,
      bill_type,
      bill_prefix,
      barcode_enabled,
    } = req.body;

    const app_user_id = 1; // Static for now
    await db.query(
      `INSERT INTO app_users 
      (id, username, app_user_designation, app_user_mobile_number, app_user_email, store_name, gst_number, currency, language, bill_type, bill_prefix, barcode_enabled)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        store_name = VALUES(store_name),
        gst_number = VALUES(gst_number),
        app_user_email = VALUES(app_user_email),
        app_user_mobile_number = VALUES(app_user_mobile_number),
        currency = VALUES(currency),
        language = VALUES(language),
        bill_type = VALUES(bill_type),
        bill_prefix = VALUES(bill_prefix),
        barcode_enabled = VALUES(barcode_enabled)`,
      [
        app_user_id,
        "Utsav Yadav",
        "Owner",
        app_user_mobile_number,
        app_user_email,
        store_name,
        gst_number,
        currency,
        language,
        bill_type,
        bill_prefix,
        barcode_enabled ? 1 : 0,
      ]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAppUserSettings = async (req, res) => {
  try {
    const userId = req.user?.id || 1;

    const [rows] = await db.query(
      "SELECT username,app_user_designation,store_name, gst_number, app_user_email, app_user_mobile_number, currency, language, bill_type, bill_prefix, barcode_enabled FROM app_users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.json({
        store_name: "",
        gst_number: "",
        app_user_email: "",
        app_user_mobile_number: "",
        currency: "INR",
        language: "en",
        bill_type: "Retail",
        bill_prefix: "",
        barcode_enabled: 0,
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching settings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = { addAppUser, getAppUserSettings };
