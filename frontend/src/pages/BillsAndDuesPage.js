import React, { useState, useEffect } from "react";
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
import axios from "axios";

const BillsAndDuesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [billsData, setBillsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [entriesLimit, setEntriesLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/billsanddues")
      .then((res) => setBillsData(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Filters
  const filteredBills = billsData
    .filter((bill) => {
      const billDate = new Date(bill.created_at);
      const today = new Date();
      const diffDays = (today - billDate) / (1000 * 60 * 60 * 24);
      return diffDays <= 30; 
    })
    .filter((bill) =>
      paymentMethod ? bill.payment_method === paymentMethod : true
    )
    .filter((bill) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        bill.customer_name.toLowerCase().includes(searchLower) ||
        new Date(bill.created_at)
          .toLocaleDateString("en-GB")
          .toLowerCase()
          .includes(searchLower) ||
        bill.grand_total.toString().includes(searchLower)
      );
    })
    .filter((bill) =>
      activeTab === "all" ? true : bill.status.toLowerCase() === activeTab
    );

  const totalPages = Math.ceil(filteredBills.length / entriesLimit);
  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * entriesLimit,
    currentPage * entriesLimit
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getLatestPdfUrl = async (billId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/billsanddues/${billId}/latest`
      );
      const result = await res.json();

      if (!result.success || (!result.fileUrl && !result.filePath)) {
        return null;
      }
      return result.fileUrl || `http://localhost:5000${result.filePath}`;
    } catch (err) {
      console.error("Error fetching PDF:", err);
      return null;
    }
  };

  const handleViewPdf = async (billId) => {
    const fileUrl = await getLatestPdfUrl(billId);
    if (fileUrl) {
      window.open(fileUrl, "_blank");
    } else {
      alert("No PDF found for this bill!");
    }
  };

  const handleSharePdf = async (bill) => {
    const fileUrl = await getLatestPdfUrl(bill.bill_number);
    if (!fileUrl) {
      alert("No PDF available to share!");
      return;
    }
    const fileName = fileUrl.split("/").pop().replace(".pdf", "");
    const msg = `Bill ${fileName} 
               Customer: ${bill.customer_name} (${bill.customer_mobile_number})
               Total: ₹${bill.grand_total}
               PDF: ${fileUrl}`;

    const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank");
  };

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
        <select
          className="filter-btn"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">All Payment Methods</option>
          <option value="Cash">Cash</option>
          <option value="Credit">Credit</option>
          <option value="UPI">UPI</option>
        </select>

        {/* 3. Search */}
        <div className="search-box">
          <FaSearch className="icon" />
          <input
            type="text"
            placeholder="Search by Name, Date, or Amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
            className={`tab ${activeTab === "due" ? "active" : ""}`}
            onClick={() => setActiveTab("due")}
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
              <th>Payment Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBills.length > 0 ? (
              paginatedBills.map((bill) => (
                <tr key={bill.id}>
                  <td>
                    {new Date(bill.created_at).toLocaleDateString("en-GB")}
                  </td>
                  <td>{bill.customer_name}</td>
                  <td>₹{bill.grand_total}</td>
                  <td>{bill.payment_method}</td>
                  <td>
                    <span className={`status ${bill.status.toLowerCase()}`}>
                      {bill.status}
                    </span>
                  </td>
                  <td className="actions">
                    <FaEye
                      className="action-icon"
                      onClick={() => handleViewPdf(bill.bill_number)}
                    />
                    <FaShareAlt
                      className="action-icon"
                      onClick={() => handleSharePdf(bill)}
                    />
                    {bill.showTick && <FaCheck className="action-icon grey" />}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No bills found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="table-footer">
          <span>
            Showing {(currentPage - 1) * entriesLimit + 1} to{" "}
            {(currentPage - 1) * entriesLimit + paginatedBills.length} of{" "}
            {filteredBills.length} entries
          </span>
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillsAndDuesPage;
