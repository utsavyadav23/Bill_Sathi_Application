import React, { useState } from "react";
import {
  FaSearch,
  FaPlus,
  FaUpload,
  FaEdit,
  FaTrash,
  FaBarcode,
  FaRupeeSign,
} from "react-icons/fa";
import "../styling/InventoryManagement.css";
import { useNavigate } from "react-router-dom";

const InventoryManagement = () => {
  const [products] = useState([
    {
      name: "Premium Tea",
      barcode: "123456",
      stock: 25,
      purchase: 120,
      selling: 150,
      category: "Beverages",
    },
    {
      name: "Organic Coffee",
      barcode: "234567",
      stock: 3,
      purchase: 200,
      selling: 250,
      category: "Beverages",
    },
    {
      name: "Whole Wheat Bread",
      barcode: "345678",
      stock: 15,
      purchase: 40,
      selling: 60,
      category: "Bakery",
    },
    {
      name: "Fresh Milk",
      barcode: "456789",
      stock: 4,
      purchase: 60,
      selling: 80,
      category: "Dairy",
    },
    {
      name: "Chocolate Bar",
      barcode: "567890",
      stock: 50,
      purchase: 30,
      selling: 45,
      category: "Snacks",
    },
    {
      name: "Mineral Water",
      barcode: "678901",
      stock: 2,
      purchase: 25,
      selling: 40,
      category: "Beverages",
    },
    {
      name: "Yogurt Pack",
      barcode: "789012",
      stock: 18,
      purchase: 80,
      selling: 120,
      category: "Dairy",
    },
    {
      name: "Fresh Eggs",
      barcode: "890123",
      stock: 24,
      purchase: 150,
      selling: 200,
      category: "Pantry",
    },
  ]);
  const navigate = useNavigate();
  return (
    <div className="inventory-container">
      {/* Header Row */}
      <div className="inventory-header-card">
        <h2 className="inventory-title">Inventory Management</h2>

        <div className="inventory-search">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search Products..." />
        </div>

        <button className="add-btn" onClick={() => navigate("/AddProduct")}>
          <FaPlus /> Add Product
        </button>

        <button className="upload-btn">
          <FaUpload /> Bulk Upload
        </button>
      </div>

      {/* Filters Row */}
      <div className="inventory-filters">
        <select>
          <option>Category</option>
          <option>Beverages</option>
          <option>Bakery</option>
          <option>Dairy</option>
          <option>Snacks</option>
          <option>Pantry</option>
        </select>

        <select>
          <option>Sort by</option>
          <option>Name</option>
          <option>Stock</option>
          <option>Price</option>
        </select>

        <div className="entries-dropdown">
          Show
          <select>
            <option>10</option>
            <option>20</option>
            <option>50</option>
            <option>100</option>
          </select>
          entries
        </div>
      </div>

      {/* Table */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Barcode</th>
            <th>Stock Quantity</th>
            <th>Purchase Price</th>
            <th>Selling Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((item, index) => (
            <tr key={index} className={index % 2 === 1 ? "alt-row" : ""}>
              <td className="product-name">
                <span className="name-initial">{item.name.charAt(0)}</span>
                {item.name}
              </td>
              <td>
                {item.barcode} <FaBarcode className="barcode-icon" />
              </td>
              <td className={item.stock < 10 ? "low-stock" : ""}>
                {item.stock}
              </td>
              <td>
                <FaRupeeSign className="rupee-icon" /> {item.purchase}
              </td>
              <td>
                <FaRupeeSign className="rupee-icon" /> {item.selling}
              </td>
              <td>
                <span className="category-pill">{item.category}</span>
              </td>
              <td className="actions">
                <FaEdit className="edit-icon" />
                <FaTrash className="delete-icon" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div className="table-footer">
        <span>Showing 1 to 8 of 8 entries</span>
        <div className="pagination">
          <button>&lt;</button>
          <button className="active">1</button>
          <button> &gt;</button>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
