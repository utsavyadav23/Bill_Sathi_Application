import React, { useState, useEffect } from "react";
import "../styling/NewBill.css";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const EditBill = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const billData = location.state;

  // Basic Bill Info
  const [billNumber, setBillNumber] = useState("");
  const [billDate, setBillDate] = useState("");
  const [storeName, setStoreName] = useState("My Store");

  // Customer Info
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  // const [showAddCustomer, setShowAddCustomer] = useState(false);

  // Products & Items
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [billItems, setBillItems] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editUnitPrice, setEditUnitPrice] = useState("");

  // Extras
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState("%");
  const [taxValue, setTaxValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [notes, setNotes] = useState(billData?.notes ?? "");

  // Toggle
  const [manualSection, setManualSection] = useState(true);

  // Prefill bill data
  useEffect(() => {
    if (billData) {
      setBillNumber(billData.billNumber || "");
      setBillDate(billData.billDate ? billData.billDate.slice(0, 10) : "");
      setCustomerName(billData.customerName || "");
      setCustomerMobile(billData.customerMobile || "");
      setSelectedCustomerId(billData.customerId?.toString() || "");
      setBillItems(billData.billItems || []);
      setDiscountValue(billData.discountValue || "");
      setDiscountType(billData.discountType || "%");
      setTaxValue(billData.taxValue || "");
      setPaymentMethod(billData.paymentMethod || "CASH");
      setNotes(billData.notes ?? "");
    }
  }, [billData]);

  // Fetch customers & products
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));

    axios
      .get("http://localhost:5000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Subtotal & totals
  const subtotal = billItems.reduce((acc, item) => acc + (item.total || 0), 0);
  let discountAmount =
    discountType === "%"
      ? (subtotal * Number(discountValue || 0)) / 100
      : Number(discountValue || 0);
  let afterDiscount = subtotal - discountAmount;
  let taxAmount = afterDiscount * (Number(taxValue || 0) / 100);
  let total = afterDiscount + taxAmount;

  // Handle add new customer
  //   const handleSaveCustomer = async () => {
  //     if (customerName && customerMobile) {
  //       try {
  //         await axios.post("http://localhost:5000/api/customers/add", {
  //           name: customerName,
  //           mobile: customerMobile,
  //         });
  //         const res = await axios.get("http://localhost:5000/api/customers");
  //         setCustomers(res.data);
  //         setSelectedCustomerId(res.data[0]?.id || "");
  //         setCustomerName("");
  //         setCustomerMobile("");
  //         setShowAddCustomer(false);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //   };

  //  Add new item to bill
  const handleAddBillItem = async () => {
    if (selectedProduct && quantity > 0 && unitPrice) {
      try {
        const productDetails = products.find(
          (p) => p.id === Number(selectedProduct)
        );
        const response = await axios.post(
          "http://localhost:5000/api/bill-items",
          {
            bill_id: billData.id,
            product_id: Number(selectedProduct),
            quantity,
            unit_price: unitPrice,
          }
        );

        const newItem = {
          id: response.data.id,
          product: productDetails.product_name,
          quantity,
          unitPrice,
          total: quantity * unitPrice,
        };

        setBillItems([...billItems, newItem]);
        setSelectedProduct("");
        setQuantity("");
        setUnitPrice("");
      } catch (err) {
        console.error("Error adding bill item:", err);
        alert("Failed to add item");
      }
    }
  };
  // Edit item
  const handleEdit = (index, item) => {
    setEditingIndex(index);
    setEditQuantity(item.quantity);
    setEditUnitPrice(item.unitPrice);
  };
  const handleSaveEdit = async (index, item) => {
    try {
      await axios.put(`http://localhost:5000/api/bill-items/${item.id}`, {
        quantity: editQuantity,
        unitPrice: editUnitPrice,
      });

      const updatedItem = {
        ...item,
        quantity: editQuantity,
        unitPrice: editUnitPrice,
        total: editQuantity * editUnitPrice,
      };
      const updatedBillItems = [...billItems];
      updatedBillItems[index] = updatedItem;
      setBillItems(updatedBillItems);
      setEditingIndex(null);
    } catch (err) {
      console.error("Error updating item:", err);
      alert("Failed to update item");
    }
  };

  // Delete item
  const handleDelete = async (index) => {
    const item = billItems[index];
    if (!item?.id) {
      // item not saved yet, just remove from state
      setBillItems(billItems.filter((_, i) => i !== index));
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/bill-items/${item.id}`);
      setBillItems(billItems.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("Failed to delete item");
    }
  };

  // Save edited bill
  const handleUpdateBill = async () => {
    try {
      // API call to save
      await axios.put(`http://localhost:5000/api/bills/${billData.id}`, {
        customer_id: Number(selectedCustomerId || billData.customerId),
        total: subtotal,
        discount: discountAmount,
        tax: taxAmount,
        grand_total: total,
        status: paymentMethod === "CREDIT" ? "Due" : "Paid",
        payment_method: paymentMethod,
        notes,
      });

      navigate("/BillPreview", {
        state: {
          ...billData,
          billItems,
          subtotal,
          discountType,
          discountValue,
          discountAmount,
          taxAmount,
          taxValue,
          total,
          paymentMethod,
          notes,
          storeName,
        },
      });
    } catch (error) {
      console.error("Error saving bill:", error);
      alert("Failed to save bill");
    }
  };

  // Cancel
  const handleCancel = () => {
    const subtotal = billItems.reduce(
      (acc, item) => acc + (item.total || 0),
      0
    );
    const discountAmount =
      discountType === "%"
        ? (subtotal * Number(discountValue || 0)) / 100
        : Number(discountValue || 0);
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * (Number(taxValue || 0) / 100);
    const total = afterDiscount + taxAmount;

    navigate("/BillPreview", {
      state: {
        ...billData,
        customerName,
        customerMobile,
        billItems,
        discountValue,
        discountType,
        discountAmount,
        taxValue,
        taxAmount,
        subtotal,
        total,
        paymentMethod,
        notes,
      },
    });
  };
  return (
    <div className="newbill-container">
      <div className="page-header">
        <span className="breadcrumb">Dashboard &gt; Edit Bill</span>
        <h2 className="title">Edit Bill</h2>
      </div>

      {/* Customer Info */}
      <div className="section">
        <h3 className="section-title">Customer Information</h3>
        <div className="customer-info">
          {/* <div className="form-group">
            <label>Select Customer</label>
            <select
              className="input"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customer_name}
                </option>
              ))}
            </select> */}
          {/* <span className="add-new-customer" onClick={() => setShowAddCustomer(true)}>
              <FaPlus className="plus-icon" /> Add New Customer
            </span> */}
          {/* </div> */}
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              className="input"
              value={customerName}
              readOnly
            />
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
                className="input"
                value={billNumber}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Customer Modal */}
      {/* {showAddCustomer && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add New Customer</h3>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="input" value={customerName} onChange={e => setCustomerName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Mobile</label>
              <input type="text" className="input" value={customerMobile} onChange={e => setCustomerMobile(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-blue" onClick={handleSaveCustomer}>Save</button>
              <button className="btn btn-grey" onClick={() => setShowAddCustomer(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )} */}

      {/* Products */}
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
                onChange={(e) => {
                  const prodId = e.target.value;
                  setSelectedProduct(prodId);

                  const prod = products.find((p) => p.id === Number(prodId));
                  if (prod) {
                    setUnitPrice(prod.selling_price);
                  }
                }}
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
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Unit Price</label>
              <input
                type="number"
                className="input"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
              />
            </div>
            <div className="form-group full-width">
              <button className="btn" onClick={handleAddBillItem}>
                Add Product to Bill
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bill Items Table */}
      {billItems.length > 0 && (
        <div className="section">
          <h3 className="section-title">Bill Items</h3>
          <table className="bill-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {billItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="number"
                        value={editQuantity}
                        onChange={(e) =>
                          setEditQuantity(Number(e.target.value))
                        }
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td>
                    {editingIndex === index ? (
                      <input
                        type="number"
                        value={editUnitPrice}
                        onChange={(e) =>
                          setEditUnitPrice(Number(e.target.value))
                        }
                      />
                    ) : (
                      item.unitPrice
                    )}
                  </td>
                  <td>
                    {editingIndex === index
                      ? editQuantity * editUnitPrice
                      : item.total}
                  </td>
                  <td className="action-icons">
                    {editingIndex === index ? (
                      <>
                        <button onClick={() => handleSaveEdit(index, item)}>
                          Save
                        </button>
                        <button onClick={() => setEditingIndex(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <FaEdit
                          className="edit-icon"
                          onClick={() => handleEdit(index, item)}
                        />
                        <FaTrash
                          className="delete-icon"
                          onClick={() => handleDelete(index)}
                        />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Extras & Notes */}
      <div className="section bill-extras-box">
        <div className="extras-left">
          <div className="form-group">
            <label>Discount</label>
            <div className="discount">
              <input
                type="number"
                className="input"
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
              value={taxValue}
              onChange={(e) => setTaxValue(e.target.value)}
            />
          </div>
        </div>
        <div className="extras-right">
          <label>Notes</label>
          <textarea
            className="notes-box"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      {/* Totals */}
      <div className="section totals-card">
        <div className="totals-row">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="totals-row discount-text">
            <span>
              Discount ({discountValue}
              {discountType})
            </span>
            <span>-₹{discountAmount.toFixed(2)}</span>
          </div>
        )}
        {taxAmount > 0 && (
          <div className="totals-row">
            <span>Tax ({taxValue}%)</span>
            <span>₹{taxAmount.toFixed(2)}</span>
          </div>
        )}
        <hr className="divider" />
        <div className="totals-row total-amount">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="section payment-method">
        <h3 className="section-title">Payment Method</h3>
        <div className="payment-options">
          {["UPI", "CASH", "CREDIT"].map((method) => (
            <button
              key={method}
              className={`payment-btn ${
                paymentMethod === method ? "active" : ""
              }`}
              onClick={() => setPaymentMethod(method)}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="footer-buttons">
        <button className="save-button" onClick={handleUpdateBill}>
          Save Changes
        </button>
        <button className="cancel-button" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditBill;
