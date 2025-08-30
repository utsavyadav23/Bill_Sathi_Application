import React, { useState, useEffect } from "react";
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
import { useNavigate, useLocation } from "react-router-dom";

const InventoryManagement = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Fetch products 
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setProducts([]);
      });

    if (location.state?.added) {
      console.log("Product was just added!");
    }
  }, [location]);

    useEffect(() => {
      fetch("http://localhost:5000/api/categories")
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => console.error("Error fetching categories:", err));
    }, []);

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
          {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name}
              </option>
            ))}
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
          {Array.isArray(products) && products.length > 0 ? (
            products.map((item, index) => (
              <tr key={index} className={index % 2 === 1 ? "alt-row" : ""}>
                <td className="product-name">
                  <span className="name-initial">
                    {item.product_name?.charAt(0)}
                  </span>
                  {item.product_name}
                </td>
                <td>
                  {item.barcode} <FaBarcode className="barcode-icon" />
                </td>
                <td className={item.stock < 10 ? "low-stock" : ""}>
                  {item.stock}
                </td>
                <td>
                  <FaRupeeSign className="rupee-icon" /> {item.purchase_price}
                </td>
                <td>
                  <FaRupeeSign className="rupee-icon" /> {item.selling_price}
                </td>
                <td>
                  <span className="category-pill">{item.category}</span>
                </td>
                <td className="actions">
                  <FaEdit className="edit-icon" />
                  <FaTrash className="delete-icon" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No products found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="table-footer">
        <span>
          Showing 1 to {products.length} of {products.length} entries
        </span>
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
