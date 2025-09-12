import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSignOutAlt } from "react-icons/fa";
import "../styling/Settings.css";

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [language, setLanguage] = useState("en");
  const [barcodeEnabled, setBarcodeEnabled] = useState(false);
  const [billType, setBillType] = useState("Retail");
  const [billPrefix, setBillPrefix] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  // Fetch existing settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/appUsers/settings"
        );
        const data = response.data;

        setStoreName(data.store_name || "");
        setGstNumber(data.gst_number || "");
        setEmail(data.app_user_email || "");
        setMobile(data.app_user_mobile_number || "");
        setCurrency(data.currency || "INR");
        setLanguage(data.language || "en");
        setBillType(data.bill_type || "Retail");
        setBillPrefix(data.bill_prefix || "");
        setBarcodeEnabled(data.barcode_enabled === 1);
      } catch (error) {
        console.error("Error fetching settings:", error);
        alert("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/appUsers/settings", {
        store_name: storeName,
        gst_number: gstNumber,
        app_user_email: email,
        app_user_mobile_number: mobile,
        currency,
        language,
        bill_type: billType,
        bill_prefix: billPrefix,
        barcode_enabled: barcodeEnabled ? 1 : 0,
      });
      alert("Settings saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving settings!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="settings-container">Loading settings...</div>;
  }

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-card">
        <h2 className="section-title">General Settings</h2>
        <label className="settings-label">Business Name</label>
        <input
          type="text"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          placeholder="Enter your business name"
          className="settings-input"
        />

        <label className="settings-label">GST Number (Optional)</label>
        <input
          type="text"
          value={gstNumber}
          onChange={(e) => setGstNumber(e.target.value)}
          placeholder="Enter GST number"
          className="settings-input"
        />

        <label className="settings-label">Currency</label>
        <select
          className="settings-input"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option>INR</option>
        </select>

        <label className="settings-label">Language Preference</label>
        <select
          className="settings-input"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
        </select>
      </div>

      <div className="settings-card">
        <h2 className="section-title">Billing Preference</h2>
        <div className="toggle-row">
          <div>
            <p className="settings-label">Enable Barcode Scanning</p>
            <p className="small-text">Scan barcodes directly while billing</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={barcodeEnabled}
              onChange={(e) => setBarcodeEnabled(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <label className="settings-label">Default Bill Type</label>
        <select
          className="settings-input"
          value={billType}
          onChange={(e) => setBillType(e.target.value)}
        >
          <option>Retail</option>
          <option>Wholesale</option>
        </select>

        <label className="settings-label">Bill Prefix</label>
        <input
          type="text"
          value={billPrefix}
          onChange={(e) => setBillPrefix(e.target.value)}
          placeholder="e.g. INV-"
          className="settings-input"
        />
      </div>

      <div className="settings-card">
        <h2 className="section-title">Account Management</h2>
        <label className="settings-label">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
          className="settings-input"
        />

        <label className="settings-label">Mobile Number</label>
        <div className="mobile-input">
          <span className="country-code">+91</span>
          <input
            type="text"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter mobile number"
            className="settings-input"
          />
        </div>

        <div className="button-row">
          <button className="reset-btn">Reset Password</button>
          <button className="logout-btn">
            <FaSignOutAlt className="logout-icon" /> Logout
          </button>
        </div>
      </div>

      <div className="button-row">
        <button className="save-btn" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
