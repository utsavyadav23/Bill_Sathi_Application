import React, { useEffect, useState } from "react";
import "../styling/Reports.css";
import { FaDownload, FaArrowUp, FaArrowDown } from "react-icons/fa";
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
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Reports = () => {
  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${parseFloat(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const [totalCustomers, setTotalCustomers] = useState(0);
  const [monthSales, setMonthSales] = useState(0);
  const [monthPurchases, setMonthPurchases] = useState(0);
  const [topItem, setTopItem] = useState({ product_name: "", total_sold: 0 });
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [monthlySalesGrowth, setMonthlySalesGrowth] = useState(0);
  const [monthlyCustomerGrowth, setMonthlyCustomerGrowth] = useState(0);
  const [monthlyPurchaseGrowth, setMonthlyPurchaseGrowth] = useState(0);

  useEffect(() => {
    const fetchMonthSales = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/bills/month-sales"
        );
        setMonthSales(response.data.month_sales);
        setMonthlySalesGrowth(response.data.growth);
      } catch (error) {
        console.error("Error fetching bill sums:", error);
      }
    };
    fetchMonthSales();
  }, []);

  useEffect(() => {
    const fetchCustomerCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/customers/count"
        );
        setTotalCustomers(response.data.total);
        setMonthlyCustomerGrowth(response.data.growth);
      } catch (error) {
        console.error("Error fetching product count:", error);
      }
    };
    fetchCustomerCount();
  }, []);

  useEffect(() => {
    const fetchMonthPurchases = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/purchases/month-purchases"
        );
        setMonthPurchases(response.data.month_purchases);
        setMonthlyPurchaseGrowth(response.data.growth);
      } catch (error) {
        console.error("Error fetching purchase sums:", error);
      }
    };
    fetchMonthPurchases();
  }, []);

  useEffect(() => {
    const fetchTopItem = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/reports/top-selling"
        );
        setTopItem(response.data);
      } catch (error) {
        console.error("Error fetching top selling item:", error);
      }
    };
    fetchTopItem();
  }, []);

  useEffect(() => {
    const fetchRevenueByCategory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/reports/revenue-by-category"
        );

        const colors = ["#007bff", "#28a745", "#dc3545", "#ffc107", "#6c757d"];
        const formatted = response.data.map((item, index) => ({
          name: item.category_name,
          value: parseFloat(item.revenue),
          color: colors[index % colors.length],
        }));

        setPieData(formatted);
      } catch (error) {
        console.error("Error fetching revenue by category:", error);
      }
    };
    fetchRevenueByCategory();
  }, []);

  useEffect(() => {
    const fetchSalesVsPurchases = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/reports/sales-vs-purchases"
        );

        const formatted = response.data.map((item) => ({
          name: item.month,
          Sales: item.Sales,
          Purchases: item.Purchases,
        }));

        setLineData(formatted);
      } catch (error) {
        console.error("Error fetching sales vs purchases:", error);
      }
    };

    fetchSalesVsPurchases();
  }, []);

  const handleDownloadReport = async () => {
    try {
      const element = document.querySelector(".reports-container");
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output("blob");
      const formData = new FormData();
      const currentMonth = new Date().toISOString().slice(0, 7);
      formData.append("file", pdfBlob, `${currentMonth}-report.pdf`);
      formData.append("month", currentMonth);

      await fetch("http://localhost:5000/api/reports/upload", {
        method: "POST",
        body: formData,
      });

      alert("Report saved successfully!");
    } catch (err) {
      console.error("Download Report Error:", err);
      alert("Error while downloading report!");
    }
  };

  return (
    <div className="reports-container">
      {/* Reports Summary Header */}
      <div className="reports-header-card">
        <h2>Reports Summary</h2>
        <button className="download-btn" onClick={handleDownloadReport}>
          <FaDownload className="download-icon" /> Download Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="reports-stat-grid">
        {/* Total Sales */}
        <div className="reports-stat-card">
          <div className="reports-card-header">
            <span>Total Sales</span>
            {monthlySalesGrowth >= 0 ? (
              <FaArrowUp className="arrow positive" />
            ) : (
              <FaArrowDown className="arrow negative" />
            )}
          </div>
          <h2>{formatCurrency(monthSales)}</h2>
          <p className="growth">
            <span className={monthlySalesGrowth >= 0 ? "positive" : "negative"}>
              {monthlySalesGrowth >= 0
                ? `+${monthlySalesGrowth}%`
                : `${monthlySalesGrowth}%`}
            </span>
            <span>This Month</span>
          </p>
        </div>

        {/* Total Purchases */}
        <div className="reports-stat-card">
          <div className="reports-card-header">
            <span>Total Purchases</span>
            {monthlyPurchaseGrowth >= 0 ? (
              <FaArrowUp className="arrow positive" />
            ) : (
              <FaArrowDown className="arrow negative" />
            )}
          </div>
          <h2>{formatCurrency(monthPurchases)}</h2>
          <p className="growth">
            <span
              className={monthlyPurchaseGrowth >= 0 ? "positive" : "negative"}
            >
              {monthlyPurchaseGrowth >= 0
                ? `+${monthlyPurchaseGrowth}%`
                : `${monthlyPurchaseGrowth}%`}
            </span>
            <span>This Month</span>
          </p>
        </div>

        {/* Total Customers */}
        <div className="reports-stat-card">
          <div className="reports-card-header">
            <span>Total Customers</span>
            {monthlyCustomerGrowth >= 0 ? (
              <FaArrowUp className="arrow positive" />
            ) : (
              <FaArrowDown className="arrow negative" />
            )}{" "}
          </div>
          <h2>{totalCustomers}</h2>
          <p className="growth">
            <span
              className={monthlyCustomerGrowth >= 0 ? "positive" : "negative"}
            >
              {monthlyCustomerGrowth >= 0
                ? `+${monthlyCustomerGrowth}%`
                : `${monthlyCustomerGrowth}%`}
            </span>
            <span>Active Customers</span>
          </p>
        </div>

        {/* Top Selling Item */}
        <div className="reports-stat-card">
          <div className="reports-card-header">
            <span>Top Selling Item</span>
          </div>
          <h2>{topItem.product_name}</h2>
          <p>{topItem.total_sold} units Most Sold Item</p>
        </div>
      </div>

      {/* Graphs Section */}
      <div className="graphs-container">
        <div className="graph-card">
          <h3>Sales vs Purchases</h3>
          <LineChart width={500} height={300} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
            />
            <Legend />
            <Line type="monotone" dataKey="Sales" stroke="#007bff" />
            <Line type="monotone" dataKey="Purchases" stroke="#28a745" />
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
              nameKey="name"
              label
              stroke="#fff"
              strokeWidth={2}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
            />
          </PieChart>

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
