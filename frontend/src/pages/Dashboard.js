import React, { useEffect, useState } from "react";
import "../styling/Dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    <img src={icon} alt="icon" />
    <div>
      <div className="activity-title">{title}</div>
      <div className="activity-time">
        <img src={ClockIcon} alt="time" />
        <span>{time}</span>
      </div>
    </div>
  </div>
);

const getIconByType = (type) => {
  switch (type) {
    case "bill_created":
      return addNewIcon;
    case "payment_received":
      return MoneyIcon;
    case "product_added":
      return CartIcon;
    case "inventory_updated":
      return CartIcon;
    default:
      return ClockIcon;
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [productCount, setProductCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalDue, setTotalDue] = useState(0);
  const [activities, setActivities] = useState([]);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const stats = [
    {
      title: "Today's Sale",
      value: formatCurrency(totalSales),
      icon: SaleIcon,
    },
    { title: "Pending Dues", value: formatCurrency(totalDue), icon: DuesIcon },
    { title: "Product", value: `${productCount} Products`, icon: ProductIcon },
  ];

  const actions = [
    { title: "New Bill", icon: addNewIcon, path: "/NewBill" },
    { title: "Scan Product", icon: ScanIcon, path: "/AddProduct" },
    { title: "View Dues", icon: MoneyIcon, path: "/Bills" },
    { title: "Add Inventory", icon: CartIcon, path: "/Inventory" },
  ];

  const ActionBox = ({ title, icon, path }) => (
    <div className="action-box" onClick={() => navigate(path)}>
      <img src={icon} alt={title} />
      <span>{title}</span>
    </div>
  );

  // Fetch product count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products/count"
        );
        setProductCount(response.data.total);
      } catch (error) {
        console.error("Error fetching product count:", error);
      }
    };
    fetchCount();
  }, []);

  // Fetch today's sales and total due

  useEffect(() => {
    const fetchBillSums = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/bills/sums"
        );
        setTotalSales(response.data.today_sales);
        setTotalDue(response.data.total_due);
      } catch (error) {
        console.error("Error fetching bill sums:", error);
      }
    };
    fetchBillSums();
  }, []);

  // Fetch recent activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/appusers/latest?limit=5"
        );
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchActivities();
  }, []);

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
        {activities.map((a) => (
          <ActivityBox
            key={a.id}
            icon={getIconByType(a.type)}
            title={a.description}
            time={new Date(a.created_at).toLocaleString("en-US")}
          />
        ))}
      </div>
    </div>
  );
}
