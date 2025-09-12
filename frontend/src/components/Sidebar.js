import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./../styling/Sidebar.css";

// Assets
import mainLogo from "../assets/logo.svg";
import profileIcon from "../assets/profile.png";
import logoutIcon from "../assets/logout.svg";

// Menu Icons
import dashboardIcon from "../assets/dashboard.svg";
import billsIcon from "../assets/bills.svg";
import inventoryIcon from "../assets/inventory.svg";
import duesIcon from "../assets/dues.svg";
import reportsIcon from "../assets/reports.svg";
import settingsIcon from "../assets/settings.svg";
import subscriptionIcon from "../assets/subscription.svg";

const menuItems = [
  { path: "/Dashboard", icon: dashboardIcon, label: "Dashboard" },
  { path: "/NewBill", icon: billsIcon, label: "New Bill" },
  { path: "/Inventory", icon: inventoryIcon, label: "Inventory" },
  { path: "/Bills", icon: duesIcon, label: "Bills & Dues" },
  { path: "/Reports", icon: reportsIcon, label: "Reports" },
  { path: "/Settings", icon: settingsIcon, label: "Settings" },
  { path: "/Subscription", icon: subscriptionIcon, label: "Subscription" },
];

const Sidebar = () => {
  const [user, setUser] = useState({ username: "", app_user_designation: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/appUsers/settings"
        );
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <img src={mainLogo} alt="BillSathi Logo" className="sidebar-logo" />
        <h1 className="sidebar-title">BillSathi</h1>
      </div>

      {/* Menu */}
      <ul className="sidebar-menu">
        {menuItems.map(({ path, icon, label }) => (
          <li key={path}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `menu-link ${isActive ? "active" : ""}`
              }
            >
              <img src={icon} alt={label} className="menu-icon" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Profile */}
      <div className="sidebar-profile">
        <div className="profile-info">
          <img src={profileIcon} alt="Profile" className="profile-img" />
          <div className="profile-text">
            <p className="name">
              {loading ? "Loading..." : user?.username || "Unknown"}
            </p>
            <p className="role">
              {loading ? "..." : user?.app_user_designation || "No Role"}
            </p>
          </div>
        </div>
        <img src={logoutIcon} alt="Logout" className="logout-icon" />
      </div>
    </div>
  );
};

export default Sidebar;
