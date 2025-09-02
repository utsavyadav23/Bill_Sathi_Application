import React, { useState } from "react";
import {
  FaCalendarAlt,
  FaSearch,
  FaEye,
  FaShareAlt,
  FaCheck,
  FaFilter,
} from "react-icons/fa";
import "../styling/BillsAndDuesPage.css";
import { useNavigate } from "react-router-dom";

const BillsAndDuesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  const billsData = [
    {
      date: "15/02/2025",
      customer: "John Anderson",
      amount: "₹1250.00",
      status: "Paid",
      showTick: true,
    },
    {
      date: "12/12/2024",
      customer: "Sarah Williams",
      amount: "₹1850.00",
      status: "Due",
      showTick: false,
    },
    {
      date: "05/11/2024",
      customer: "Michael Brown",
      amount: "₹920.00",
      status: "Paid",
      showTick: true,
    },
    {
      date: "01/11/2024",
      customer: "Emily Davis",
      amount: "₹2100.00",
      status: "Due",
      showTick: false,
    },
    {
      date: "20/10/2024",
      customer: "David Wilson",
      amount: "₹750.00",
      status: "Paid",
      showTick: false,
    },
  ];

  return (
    <div className="bills-container">
      {/* Header */}
      <div className="card header-card">
        <div className="header-card-left">
          <h1 className="page-title">Bills & Dues</h1>
          <p className="page-subtitle">
            Manage your billing history and outstanding payments
          </p>
        </div>
        <button className="new-bill-btn" onClick={() => navigate("/NewBill")}>
          Create New Bill
        </button>
      </div>

      {/* Filters */}
      <div className="card filters-card">
        <button className="filter-btn">
          <FaCalendarAlt className="icon" /> Last 30 days
        </button>
        <select className="filter-btn">
          <option>All Payment Modes</option>
          <option>Cash</option>
          <option>Credit</option>
          <option>UPI</option>
        </select>
        <div className="search-box">
          <FaSearch className="icon" />
          <input type="text" placeholder="Search Bills..." />
        </div>
      </div>

      {/* Tabs */}
      <div className="card tabs-card">
        <div className="tabs">
          <span
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Bills
          </span>
          <span
            className={`tab ${activeTab === "paid" ? "active" : ""}`}
            onClick={() => setActiveTab("paid")}
          >
            Paid Bills
          </span>
          <span
            className={`tab ${activeTab === "dues" ? "active" : ""}`}
            onClick={() => setActiveTab("dues")}
          >
            Dues
          </span>
        </div>

        {/* Table */}
        <table className="bills-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer Name</th>
              <th>Total Amount</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {billsData.map((bill, index) => (
              <tr key={index} className={index % 2 === 0 ? "even" : "odd"}>
                <td>{bill.date}</td>
                <td>{bill.customer}</td>
                <td>{bill.amount}</td>
                <td>
                  <span
                    className={`status ${
                      bill.status === "Paid" ? "paid" : "due"
                    }`}
                  >
                    {bill.status}
                  </span>
                </td>
                <td className="actions">
                  <FaEye className="action-icon" />
                  <FaShareAlt className="action-icon" />
                  {bill.showTick && <FaCheck className="action-icon grey" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="table-footer">
          <span className="entries-info">Showing 1 of 5 of 25 entries</span>
          <div className="pagination">
            <button>{"<"}</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>5</button>
            <button>{">"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillsAndDuesPage;
