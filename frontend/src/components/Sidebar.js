import React from "react";
import { Link } from "react-router-dom";
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
            <Link to={path}>
              <img src={icon} alt={label} className="menu-icon" />
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Profile */}
      <div className="sidebar-profile">
        <div className="profile-info">
          <img src={profileIcon} alt="Profile" className="profile-img" />
          <div className="profile-text">
            <p className="name">Ravi Kumar</p>
            <p className="role">Electrical Owner</p>
          </div>
        </div>
        <img src={logoutIcon} alt="Logout" className="logout-icon" />
      </div>
    </div>
  );
};

export default Sidebar;
