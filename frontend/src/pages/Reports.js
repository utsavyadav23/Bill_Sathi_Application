import React from "react";
import "../styling/Reports.css";
import {
  FaDownload,
  FaArrowUp,
  FaArrowDown,
  FaChevronRight,
} from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Reports = () => {
  // Data for line chart
  const lineData = [
    { name: "Jan", Sales: 80000, Expenses: 60000 },
    { name: "Feb", Sales: 95000, Expenses: 70000 },
    { name: "Mar", Sales: 70000, Expenses: 50000 },
    { name: "Apr", Sales: 120000, Expenses: 80000 },
    { name: "May", Sales: 100000, Expenses: 75000 },
    { name: "Jun", Sales: 130000, Expenses: 90000 },
  ];

  // Data for pie chart
  const pieData = [
    { name: "Groceries", value: 35, color: "#007bff" },
    { name: "Household", value: 25, color: "#28a745" },
    { name: "Beverage", value: 20, color: "#dc3545" },
    { name: "Snacks", value: 15, color: "#ffc107" },
    { name: "Others", value: 5, color: "#6c757d" },
  ];

  return (
    <div className="reports-container">
      {/* Reports Summary Header */}
      <div className="reports-header-card">
        <h2>Reports Summary</h2>
        <button className="download-btn">
          <FaDownload className="download-icon" /> Download Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="reports-stat-grid">
        {/* Total Sales */}
        <div className="reports-stat-card">
          <div className="reports-card-header">
            <span>Total Sales</span>
            <FaArrowUp className="arrow positive" />
          </div>
          <h2>₹ 1,24,500</h2>
          <p className="growth">
            <span className="positive">+12%</span> <span>This Month</span>
          </p>
        </div>

        {/* Total Purchases */}
        <div className="reports-stat-card">
          <div className="reports-card-header">
            <span>Total Purchases</span>
            <FaArrowDown className="arrow negative" />
          </div>
          <h2>₹ 82,300</h2>
          <p className="growth">
            <span className="negative">-5%</span> <span>This Month</span>
          </p>
        </div>

        {/* Total Customers */}
        <div className="reports-stat-card">
          <div className="reports-card-header">
            <span>Total Customers</span>
            <FaArrowUp className="arrow positive" />
          </div>
          <h2>847</h2>
          <p className="growth">
            <span className="positive">+8%</span> <span>Active Customers</span>
          </p>
        </div>

        {/* Top Selling Item */}
        <div className="reports-stat-card">
          <div className="reports-card-header">
            <span>Top Selling Item</span>
          </div>
          <h2>Tata Salt 1kg</h2>
          <p>1,234 units Most Sold Item</p>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="graphs-container">
        {/* Sales vs Expenses Graph */}
        <div className="graph-card">
          <h3>Sales vs Expenses</h3>
          <LineChart width={500} height={300} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis ticks={[35000, 70000, 105000, 140000]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Sales" stroke="#007bff" />
            <Line type="monotone" dataKey="Expenses" stroke="#dc3545" />
          </LineChart>
        </div>

        {/* Pie Chart */}
        <div className="graph-card">
          <h3>Revenue by Category </h3>
          <PieChart width={400} height={300}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey="value"
              label
              stroke="#fff"
              strokeWidth={2}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>

          {/* Horizontal Legend */}
          <div className="pie-legend-horizontal">
            {pieData.map((item, i) => (
              <div key={i} className="legend-item">
                <span
                  className="legend-box"
                  style={{ background: item.color }}
                ></span>
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
