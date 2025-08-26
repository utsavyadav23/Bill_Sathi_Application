import React from "react";
import "../styling/Settings.css";
import { FaSignOutAlt } from "react-icons/fa";

const Settings = () => {
  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      {/* General Settings Card */}
      <div className="settings-card">
        <h2 className="section-title">General Settings</h2>

        <label className="settings-label">Business Name</label>
        <input
          type="text"
          placeholder="Enter your business name"
          className="settings-input"
        />

        <label className="settings-label">GST Number (Optional)</label>
        <input
          type="text"
          placeholder="Enter GST number"
          className="settings-input"
        />

        <label className="settings-label">Currency</label>
        <select className="settings-input">
          <option>INR</option>
        </select>

        <label className="settings-label">Language Preference</label>
        <select className="settings-input">
          <option>en</option>
        </select>
      </div>

      {/* Billing Preference Card */}
      <div className="settings-card">
        <h2 className="section-title">Billing Preference</h2>

        <div className="toggle-row">
          <div>
            <p className="settings-label">Enable Barcode Scanning</p>
            <p className="small-text">Scan barcodes directly while billing</p>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>

        <label className="settings-label">Default Bill Type</label>
        <select className="settings-input">
          <option>Retail</option>
        </select>

        <label className="settings-label">Bill Prefix</label>
        <input type="text" placeholder="e.g. INV-" className="settings-input" />
      </div>

      {/* Account Management Card */}
      <div className="settings-card">
        <h2 className="section-title">Account Management</h2>

        <label className="settings-label">Email Address</label>
        <input
          type="email"
          placeholder="Enter email address"
          className="settings-input"
        />

        <label className="settings-label">Mobile Number</label>
        <div className="mobile-input">
          <span className="country-code">+91</span>
          <input
            type="text"
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
    </div>
  );
};

export default Settings;
