import React, { useState, useEffect } from "react";
import "../styling/NewBill.css";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewBill = () => {
  const navigate = useNavigate();
  const [billNumber] = useState("BILL-1001");
  const [manualSection, setManualSection] = useState(true);

  // Customer states
  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  // Product states
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [billDate, setBillDate] = useState(today);
  const [storeName] = useState("My Store");
  const [billItems, setBillItems] = useState([]);

  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState("%");
  const [taxValue, setTaxValue] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Add product to bill
  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0 && unitPrice) {
      const productDetails = products.find(
        (p) => p.id === Number(selectedProduct)
      );

      setBillItems([
        ...billItems,
        {
          product: productDetails
            ? productDetails.product_name
            : selectedProduct,
          quantity,
          unitPrice,
          total: Number(quantity) * Number(unitPrice),
        },
      ]);

      setSelectedProduct("");
      setQuantity("");
      setUnitPrice("");
    }
  };

  const handlePreview = () => {
    navigate("/BillPreview", {
      state: {
        billNumber,
        billDate,
        customerName,
        customerMobile,
        storeName,
        billItems,
      },
    });
  };

  const handleDelete = (index) => {
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Save new customer
  const handleSaveCustomer = async () => {
    if (customerName && customerMobile) {
      try {
        await axios.post("http://localhost:5000/api/customers/add", {
          name: customerName,
          mobile: customerMobile,
        });

        const res = await axios.get("http://localhost:5000/api/customers");
        setCustomers(res.data);

        setCustomerName("");
        setCustomerMobile("");
        setShowAddCustomer(false);
      } catch (error) {
        console.error(error);
      }
    }
  };
  // Subtotal
  const subtotal = billItems.reduce((acc, item) => acc + item.total, 0);

  // Final total calculation
  let total = subtotal;

  // Apply discount
  let discountAmount = 0;
  if (discountValue) {
    if (discountType === "%") {
      discountAmount = subtotal * (Number(discountValue) / 100);
      total = subtotal - discountAmount;
    } else {
      discountAmount = Number(discountValue);
      total = subtotal - discountAmount;
    }
  }

  // Apply tax
  let taxAmount = 0;
  if (taxValue) {
    taxAmount = total * (Number(taxValue) / 100);
    total = total + taxAmount;
  }

  // Prevent negative totals
  if (total < 0) total = 0;
  return (
    <div className="newbill-container">
      {/* Header */}
      <div className="page-header">
        <span className="breadcrumb">Dashboard &gt; New Bill</span>
        <h2 className="title">Create New Bill</h2>
      </div>
      {/* Customer Information */}
      <div className="section">
        <h3 className="section-title">Customer Information</h3>
        <div className="customer-info">
          <div className="form-group">
            <label>Select Existing Customer</label>
            <select
              className="input"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            >
              <option value="">Select Existing Customer</option>
              {customers.map((cust) => (
                <option key={cust.id} value={cust.customer_name}>
                  {cust.customer_name}
                </option>
              ))}
            </select>
            <span
              className="add-new-customer"
              onClick={() => setShowAddCustomer(true)}
            >
              <FaPlus className="plus-icon" /> Add New Customer
            </span>
          </div>

          <div className="date-bill">
            <div className="form-group">
              <label>Bill Date</label>
              <input
                type="date"
                className="input"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Bill Number</label>
              <input
                type="text"
                value={billNumber}
                readOnly
                className="input"
              />
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Add Customer */}
      {showAddCustomer && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add New Customer</h3>
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                className="input"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="text"
                className="input"
                value={customerMobile}
                onChange={(e) => setCustomerMobile(e.target.value)}
                placeholder="Enter mobile number"
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-blue" onClick={handleSaveCustomer}>
                Save
              </button>
              <button
                className="btn btn-grey"
                onClick={() => setShowAddCustomer(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Product Section */}
      <div className="section">
        <div className="toggle-buttons">
          <button
            className={manualSection ? "active" : ""}
            onClick={() => setManualSection(true)}
          >
            Manual Section
          </button>
          <button
            className={!manualSection ? "active" : ""}
            onClick={() => setManualSection(false)}
          >
            Barcode Scanner
          </button>
        </div>

        {manualSection && (
          <div className="manual-section">
            <div className="form-group">
              <label>Product</label>
              <select
                className="input"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="">Select Product</option>
                {products.map((prod) => (
                  <option key={prod.id} value={prod.id}>
                    {prod.product_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                className="input"
                placeholder="Enter quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>Unit Price</label>
              <input
                type="number"
                className="input"
                placeholder="₹ 0.00"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
              />
            </div>

            <div className="form-group full-width">
              <button className="btn" onClick={handleAddProduct}>
                Add Product to Bill
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Bill Items */}
      {billItems.length > 0 && (
        <div className="section">
          <h3 className="section-title">Bill Items</h3>
          <table className="bill-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice}</td>
                  <td>{item.total}</td>
                  <td className="action-icons">
                    <FaEdit className="edit-icon" />
                    <FaTrash
                      className="delete-icon"
                      onClick={() => handleDelete(index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Bill Extras */}
      <div className="section bill-extras-box">
        {/* Left Box */}
        <div className="extras-left">
          <h3 className="section-title">Bill Extras</h3>
          <div className="form-group">
            <label>Discount</label>
            <div className="discount">
              <input
                type="number"
                className="input"
                placeholder="Enter discount"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
              <select
                className="input"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
              >
                <option value="%">%</option>
                <option value="₹">₹</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Tax</label>
            <input
              type="number"
              className="input"
              placeholder="Enter tax percentage"
              value={taxValue}
              onChange={(e) => setTaxValue(e.target.value)}
            />
          </div>
        </div>{" "}
        {/* ✅ CLOSE extras-left properly */}
        {/* Right Box */}
        <div className="extras-right">
          <h3 className="section-title">Notes</h3>
          <textarea
            className="input notes-box"
            placeholder="Add any additional notes"
            rows="6"
          ></textarea>
        </div>
      </div>

      {/* Totals Card */}
      <div className="section totals-card">
        <div className="totals">
          <div className="totals-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          {discountValue && (
            <div className="totals-row discount-text">
              <span>
                Discount ({discountValue}
                {discountType})
              </span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}

          {taxValue && (
            <div className="totals-row">
              <span>Tax ({taxValue}%)</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
          )}

          <hr className="divider" />
          <div className="totals-row total-amount">
            <span>Total Amount</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="footer-buttons">
        <button onClick={handlePreview} className="preview-button">
          Preview Bill
        </button>
        <button className="send-button">Send via WhatsApp</button>
        <button>Save as Draft</button>
        <button>Cancel</button>
      </div>
    </div>
  );
};

export default NewBill;
