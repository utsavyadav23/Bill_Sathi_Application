import "../styling/BillPreview.css";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BillPreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <p>No bill data available</p>;
  }

  const {
    billNumber,
    billDate,
    customerName,
    customerMobile,
    storeName,
    billItems,
  } = state;

  const totalAmount = billItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const handleGoBack = () => navigate(-1);
  const handleEdit = () => navigate("/newbill", { state });
  const handlePrint = () => window.print();
  const handleDownloadPDF = () => alert("PDF download coming soon!");
  const handleShareWhatsApp = () => {
    const msg = `Bill ${billNumber} | ${storeName}\nCustomer: ${customerName} (${customerMobile})\nTotal: ₹${totalAmount}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="bill-preview">
      {/* Header */}
      <div className="bill-preview-header">
        <button onClick={handleGoBack} className="btn-back">
          Go Back
        </button>
        <h2>Bill Preview</h2>
        <button onClick={handleEdit} className="btn-edit">
          Edit Bill
        </button>
      </div>

      {/* Card */}
      <div className="bill-card">
        {/* HEADER */}
        <div className="bill-card-header">
          <div className="header-top">
            {/* Store name on left */}
            <h1 className="store-name">{storeName}</h1>

            {/* Bill number on right */}
            <div className="bill-meta bill-no">
              <strong>Bill No:</strong> {billNumber}
            </div>
          </div>

          {/* Date */}
          <div className="header-row">
            <div className="label">Date:</div>
            <div className="value">
              {new Date(billDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>

          {/* Customer + Mobile on same row */}
          <div className="header-row customer-mobile">
            <div className="left">
              <div className="label">Customer</div>
              <div className="value">{customerName}</div>
            </div>
            <div className="right">
              <div className="label">Mobile</div>
              <div className="value">{customerMobile}</div>
            </div>
          </div>
        </div>

        {/* Items */}
        <table className="bill-items">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item, idx) => (
              <tr key={idx}>
                <td>{item.product}</td>
                <td>{item.quantity}</td>
                <td>₹{item.unitPrice}</td>
                <td>₹{item.quantity * item.unitPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bill-total">Total Amount: ₹{totalAmount}</div>
      </div>

      {/* Footer */}
      <div className="bill-footer">
        <button onClick={handleShareWhatsApp} className="btn-whatsapp">
          Share viaWhatsApp
        </button>
        <button onClick={handleDownloadPDF} className="btn-pdf">
          Download PDF
        </button>
        <button onClick={handlePrint} className="btn-print">
          Print
        </button>
        <button onClick={handleGoBack} className="btn-back">
          Go Back
        </button>
      </div>
    </div>
  );
};

export default BillPreview;
