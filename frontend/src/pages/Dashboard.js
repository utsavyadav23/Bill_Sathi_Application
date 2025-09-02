import React from "react";
import "../styling/Dashboard.css";
import { useNavigate } from "react-router-dom";

// Assets
import RemainderIcon from "../assets/Remainder.svg";
import dashboardImage from "../assets/HI.png";
import addNewIcon from "../assets/Addnew.svg";
import ScanIcon from "../assets/Scan.svg";
import MoneyIcon from "../assets/Money.svg";
import CartIcon from "../assets/Cart.svg";
import SaleIcon from "../assets/TodaySale.svg";
import DuesIcon from "../assets/PendingDues.svg";
import ProductIcon from "../assets/InventoryItems.svg";
import ClockIcon from "../assets/Clock.svg";

// Reusable Components
const StatBox = ({ title, value, icon }) => (
  <div className="stat-box">
    <img src={icon} alt={title} className="stat-icon" />
    <h3>{title}</h3>
    <p>{value}</p>
  </div>
);

const ActivityBox = ({ icon, title, time }) => (
  <div className="activity-box">
    <img src={icon} alt={title} />
    <div>
      <div className="activity-title">{title}</div>
      <div className="activity-time">
        <img src={ClockIcon} alt="time" />
        <span>{time}</span>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats = [
    { title: "Today's Sale", value: "₹12,500", icon: SaleIcon },
    { title: "Pending Dues", value: "₹4,200", icon: DuesIcon },
    { title: "Product", value: "18 Products", icon: ProductIcon },
  ];

  const actions = [
    { title: "New Bill", icon: addNewIcon, path: "/NewBill" },
    { title: "Scan Product", icon: ScanIcon, path: "/AddProduct" },
    { title: "View Dues", icon: MoneyIcon, path: "/Bills" },
    { title: "Add Inventory", icon: CartIcon, path: "/Inventory" },
  ];

  const activities = [
    { icon: addNewIcon, title: "New Bill #456 created", time: "2 hrs ago" },
    { icon: ScanIcon, title: "Product ABC scanned", time: "3 hrs ago" },
    { icon: MoneyIcon, title: "Payment received ₹1,200", time: "5 hrs ago" },
    {
      icon: CartIcon,
      title: "Inventory updated (20 items)",
      time: "Yesterday",
    },
  ];

  const ActionBox = ({ title, icon, path }) => (
    <div className="action-box" onClick={() => navigate(path)}>
      <img src={icon} alt={title} />
      <span>{title}</span>
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h2>Hello Ravi Electronics</h2>
          <img src={dashboardImage} alt="Dashboard" />
        </div>
        <div className="header-right">
          <img src={RemainderIcon} alt="Remainder" />
          <span>{dateStr}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <StatBox key={i} {...s} />
        ))}
      </div>

      {/* Actions */}
      <div className="actions-grid">
        {actions.map((a, i) => (
          <ActionBox key={i} {...a} />
        ))}
      </div>
      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        {activities.map((a, i) => (
          <ActivityBox key={i} {...a} />
        ))}
      </div>
    </div>
  );
}
