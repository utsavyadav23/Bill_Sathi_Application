import "../styling/BillPreview.css";
import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const BillPreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const billCardRef = useRef(null);

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
  const ensureBillSaved = async () => {
    if (state.id) return state.id; 

    const payload = {
      billNumber,
      customer_id: state.customerId || null,
      total: state.subtotal,
      discount: state.discountAmount,
      tax: state.taxAmount,
      grand_total: state.total,
      payment_method: state.paymentMethod,
      status: state.paymentMethod === "CREDIT" ? "due" : "paid",
      notes: state.notes || null,
    };

    console.log("📝 Auto-saving bill:", payload);

    const response = await fetch("http://localhost:5000/api/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("💾 Auto-save result:", result);

    if (result.success) {
      state.id = result.id;
      return result.id;
    } else {
      throw new Error("Failed to save bill before action");
    }
  };

  const handlePrint = async () => {
    try {
      await ensureBillSaved();
      window.print();
    } catch (err) {
      console.error("Error in print logic:", err);
      window.print(); // fallback
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const billId = await ensureBillSaved();
      const element = billCardRef.current;

      // Hide footer before capture
      const footer = element.querySelector(".bill-footer");
      if (footer) footer.style.display = "none";

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Restore footer
      if (footer) footer.style.display = "flex";

      // Upload PDF
      const pdfBlob = pdf.output("blob");
      const formData = new FormData();
      formData.append("file", pdfBlob, `${billNumber}.pdf`);
      formData.append("bill_id", billId);

      await fetch("http://localhost:5000/api/billpdfs/upload", {
        method: "POST",
        body: formData,
      });

      alert("PDF saved to DB!");
    } catch (err) {
      console.error("Download PDF error:", err);
      alert("Error while downloading PDF!");
    }
  };

  const handleSave = async () => {
    try {
      const billId = await ensureBillSaved();
      alert("Bill saved successfully! ID: " + billId);
    } catch (err) {
      console.error("Save bill error:", err);
      alert("Error while saving bill!");
    }
  };

  const handleShareWhatsApp = async () => {
    try {
      const billId = await ensureBillSaved();
      const element = billCardRef.current;
      const footer = element.querySelector(".bill-footer");
      if (footer) footer.style.display = "none";

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      if (footer) footer.style.display = "flex";
      const pdfBlob = pdf.output("blob");
      const formData = new FormData();
      formData.append("file", pdfBlob, `${billNumber}.pdf`);
      formData.append("bill_id", billId);

      const res = await fetch("http://localhost:5000/api/billpdfs/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("📤 WhatsApp upload result:", result);

      if (!result.success || (!result.filePath && !result.fileUrl)) {
        alert("Failed to upload bill PDF!");
        return;
      }
      const fileUrl =
        result.fileUrl || `http://localhost:5000${result.filePath}`;

      const msg = `Bill ${billNumber} | ${storeName}
                   Customer: ${customerName} (${customerMobile})
                   Total: ₹${state.total}
                   PDF: ${fileUrl}`;

      const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
      console.log("✅ Opening WhatsApp URL:", waUrl);
      window.open(waUrl, "_self");
    } catch (err) {
      console.error("WhatsApp share error:", err);
      alert("Error sharing bill on WhatsApp");
    }
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
        <div className="bill-card" ref={billCardRef}>
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

          {/* Totals Section */}
          <div className="bill-totals">
            <div className="totals-row">
              <span>Subtotal</span>
              <span>₹{state.subtotal.toFixed(2)}</span>
            </div>

            {state.discountValue && (
              <div className="totals-row discount-text">
                <span>
                  Discount ({state.discountValue}
                  {state.discountType})
                </span>
                <span>-₹{state.discountAmount.toFixed(2)}</span>
              </div>
            )}

            {state.taxValue && (
              <div className="totals-row">
                <span>Tax ({state.taxValue}%)</span>
                <span>₹{state.taxAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="totals-row total-amount">
              <span>Total Amount</span>
              <span>₹{state.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment method */}
          {state.paymentMethod && (
            <div className="payment-method">
              Payment done by : {state.paymentMethod}
            </div>
          )}

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
            <button onClick={handleSave} className="footer-btn-back">
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
