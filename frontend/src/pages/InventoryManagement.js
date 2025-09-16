import React, { useState, useEffect } from "react";
import axios from "axios";
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
import * as XLSX from "xlsx";

const InventoryManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // filters & pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [entriesLimit, setEntriesLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [bulkProducts, setBulkProducts] = useState([]);

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(
          "http://localhost:5000/api/products"
        );
        setProducts(productRes.data);

        const categoryRes = await axios.get(
          "http://localhost:5000/api/categories"
        );
        setCategories(categoryRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);
  // filter + sort
  const filteredProducts = products
    .filter(
      (p) =>
        p.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((p) =>
      selectedCategory ? p.category_id === Number(selectedCategory) : true
    )
    .sort((a, b) => {
      if (sortBy === "name")
        return a.product_name.localeCompare(b.product_name);
      if (sortBy === "stock") return a.stock - b.stock;
      if (sortBy === "price") return a.selling_price - b.selling_price;
      return 0;
    });

  // pagination logic
  const totalPages = Math.ceil(filteredProducts.length / entriesLimit);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * entriesLimit,
    currentPage * entriesLimit
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEdit = (id) => {
    navigate(`/EditProduct/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      setBulkProducts(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleBulkUpload = async () => {
    if (bulkProducts.length === 0) {
      alert("No products to upload");
      return;
    }

    const formData = new FormData();
    formData.append("products", JSON.stringify(bulkProducts));
    bulkProducts.forEach((p, i) => {
      if (p.imageFile) {
        formData.append("images", p.imageFile);
      }
    });

    try {
      await axios.post(
        "http://localhost:5000/api/products/bulk-upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Products uploaded successfully!");
      setBulkProducts([]);
      window.location.reload();
    } catch (err) {
      console.error("Bulk upload failed:", err);
      alert("Upload failed. Check console for details.");
    }
  };

  return (
    <div className="inventory-container">
      {/* Header Row */}
      <div className="inventory-header-card">
        <h2 className="inventory-title">Inventory Management</h2>

        <div className="inventory-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search Products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="add-btn" onClick={() => navigate("/AddProduct")}>
          <FaPlus /> Add Product
        </button>

        {bulkProducts.length === 0 ? (
          <label className="upload-btn">
            <FaUpload /> Bulk Upload
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </label>
        ) : (
          <div className="bulk-actions">
            <button className="confirm-upload-btn" onClick={handleBulkUpload}>
              Confirm Upload ({bulkProducts.length})
            </button>
            <button
              className="cancel-upload-btn"
              onClick={() => setBulkProducts([])}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {bulkProducts.length > 0 && (
        <div className="bulk-preview">
          <h3>Preview Uploaded Products</h3>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Barcode</th>
                <th>Stock</th>
                <th>Purchase Price</th>
                <th>Selling Price</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {bulkProducts.map((row, i) => (
                <tr key={i}>
                  <td>{row.product_name}</td>
                  <td>{row.barcode}</td>
                  <td>{row.stock}</td>
                  <td>{row.purchase_price}</td>
                  <td>{row.selling_price}</td>
                  <td>{row.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Filters Row */}
      <div className="inventory-filters">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.category_name}
            </option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="stock">Stock</option>
          <option value="price">Price</option>
        </select>

        <div className="entries-dropdown">
          Show
          <select
            value={entriesLimit}
            onChange={(e) => {
              setEntriesLimit(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
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
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((item, index) => (
              <tr key={item.id} className={index % 2 === 1 ? "alt-row" : ""}>
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
                  <FaEdit
                    className="edit-icon"
                    onClick={() => handleEdit(item.id)}
                  />
                  <FaTrash
                    className="delete-icon"
                    onClick={() => handleDelete(item.id)}
                  />
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
          Showing {(currentPage - 1) * entriesLimit + 1} to{" "}
          {(currentPage - 1) * entriesLimit + paginatedProducts.length} of{" "}
          {filteredProducts.length} entries{" "}
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
  );
};

export default InventoryManagement;
