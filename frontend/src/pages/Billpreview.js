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
    <div className="bill-layout">
      {/* Left column - Go Back */}
      <div className="bill-col col-left">
        <button onClick={handleGoBack} className="btn-back">
          Go Back
        </button>
      </div>

      {/* Center column - Heading + Card */}
      <div className="bill-col col-center">
        <h2 className="bill-heading">Bill Preview</h2>

        {/* Card */}
        <div className="bill-card">
          {/* HEADER */}
          <div className="bill-card-header">
            <div className="header-top">
              <h1 className="store-name">{storeName}</h1>
              <div className="bill-meta bill-no">
                <strong>Bill No:</strong> {billNumber}
              </div>
            </div>

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

          {/* ITEMS */}
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

          {/* Total */}
          <div className="bill-total">
            <div className="label">Total Amount:</div>
            <div className="value">₹{totalAmount}</div>
          </div>

          {/* Footer buttons INSIDE card */}
          <div className="bill-footer">
            <button onClick={handleShareWhatsApp} className="btn-whatsapp">
              Share via WhatsApp
            </button>
            <button onClick={handleDownloadPDF} className="btn-pdf">
              Download PDF
            </button>
            <button onClick={handlePrint} className="btn-print">
              Print
            </button>
            <button onClick={handleGoBack} className="footer-btn-back">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Right column - Edit */}
      <div className="bill-col col-right">
        <button onClick={handleEdit} className="btn-edit">
          Edit Bill
        </button>
      </div>
    </div>
  );
};

export default BillPreview;
