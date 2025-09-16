import React, { useState, useEffect } from "react";
import "../styling/AddProduct.css";
import { FaCamera, FaBarcode, FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    categoryId: "",
    purchasePrice: "",
    sellingPrice: "",
    quantity: "",
    barcode: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };
  // Add product
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("category", product.categoryId);
      formData.append("purchasePrice", product.purchasePrice);
      formData.append("sellingPrice", product.sellingPrice);
      formData.append("quantity", product.quantity);
      formData.append("barcode", product.barcode);
      if (product.image) {
        formData.append("image", product.image);
      }

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        navigate("/Inventory");

        // reset form
        setProduct({
          name: "",
          categoryId: "",
          purchasePrice: "",
          sellingPrice: "",
          quantity: "",
          barcode: "",
          image: null,
        });
      }
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  return (
    <div className="inventory-container">
      {/* Header */}
      <div className="inventory-header">
        <div className="breadcrumb">Products / Add New Product</div>
        <div className="page-title">Add New Product</div>
      </div>
      {/* Main Form Section */}
      <div className="inventory-body">
        {/* Left Side Form */}
        <div className="form-section">
          {/* Product Name */}
          <label>Product Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={product.name}
            onChange={handleInputChange}
          />
          <small>Enter a unique product name</small>

          {/* Category */}
          <label>Category *</label>
          <select
            name="categoryId"
            value={product.categoryId}
            onChange={handleInputChange}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.category_name}
              </option>
            ))}
          </select>

          {/* Prices */}
          <div className="price-row">
            <div className="price-field">
              <label>Purchase Price *</label>
              <input
                type="number"
                name="purchasePrice"
                placeholder="₹ 0.00"
                value={product.purchasePrice}
                onChange={handleInputChange}
              />
            </div>
            <div className="price-field">
              <label>Selling Price *</label>
              <input
                type="number"
                name="sellingPrice"
                placeholder="₹ 0.00"
                value={product.sellingPrice}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Stock */}
          <label>Initial Stock Quantity *</label>
          <input
            type="number"
            name="quantity"
            placeholder="Enter Quantity"
            value={product.quantity}
            onChange={handleInputChange}
          />

          {/* Barcode */}
          <label>Barcode (Optional)</label>
          <div className="barcode-row">
            <input
              type="text"
              name="barcode"
              placeholder="Scan or enter barcode"
              value={product.barcode}
              onChange={handleInputChange}
            />
            <button type="button" className="scan-btn">
              <FaBarcode /> Scan
            </button>
          </div>

          <label>Product Image (Optional)</label>
          <div className="upload-box">
            <FaCloudUploadAlt className="upload-icon" />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <p className="upload-text">Drag and drop or click to upload</p>
            <small className="upload-subtext">png, jpg up to 5MB</small>
          </div>
        </div>

        {/* Right Side Preview */}
        <div className="preview-section">
          <div className="preview-box">
            {product.image ? (
              <img
                src={URL.createObjectURL(product.image)}
                alt="preview"
                className="preview-img"
              />
            ) : (
              <FaCamera className="camera-icon" />
            )}
          </div>

          {/* Preview Details */}
          <div className="preview-details">
            <h3>Product Preview</h3>
            {!product.image && <p className="no-image">No image uploaded</p>}
            <div className="detail-row">
              <span>Purchase Price</span>
              <span>₹ {product.purchasePrice || "0.00"}</span>
            </div>
            <div className="detail-row">
              <span>Selling Price</span>
              <span>₹ {product.sellingPrice || "0.00"}</span>
            </div>
            <div className="detail-row">
              <span>Stock Quantity</span>
              <span>{product.quantity || 0} units</span>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Buttons */}
      <div className="inventory-footer">
        <button className="cancel-btn">Cancel</button>
        <button className="save-btn" onClick={handleSave}>
          Save Product
        </button>
      </div>
    </div>
  );
};

export default Inventory;
