import React, { useState, useEffect } from "react";
import "../styling/AddProduct.css"; // reuse same css
import { FaCamera, FaBarcode, FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({
    product_name: "",
    category_id: "",
    purchase_price: "",
    selling_price: "",
    stock: "",
    barcode: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch product + categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch("http://localhost:5000/api/categories");
        const catData = await catRes.json();
        setCategories(catData);

        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();

        setProduct({
          product_name: data.product_name,
          category_id: data.category_id,
          purchase_price: data.purchase_price,
          selling_price: data.selling_price,
          stock: data.stock,
          barcode: data.barcode,
          image: null,
        });

        if (data.image) {
          setPreviewImage(data.image);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchData();
  }, [id]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Update product
  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("product_name", product.product_name);
      formData.append("category_id", product.category_id);
      formData.append("purchase_price", product.purchase_price);
      formData.append("selling_price", product.selling_price);
      formData.append("stock", product.stock);
      formData.append("barcode", product.barcode);
      if (product.image && product.image instanceof File) {
        formData.append("image", product.image);
      }

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        alert("Product updated successfully!");
        navigate("/Inventory");
      } else {
        alert("Failed to update product");
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <div className="breadcrumb">Products / Edit Product</div>
        <div className="page-title">Edit Product</div>
      </div>

      <div className="inventory-body">
        <div className="form-section">
          {/* Product Name */}
          <label>Product Name *</label>
          <input
            type="text"
            name="product_name"
            value={product.product_name}
            onChange={handleInputChange}
          />

          {/* Category */}
          <label>Category *</label>

          <select
            name="category_id"
            value={product.category_id}
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
                name="purchase_price"
                value={product.purchase_price}
                onChange={handleInputChange}
              />
            </div>
            <div className="price-field">
              <label>Selling Price *</label>
              <input
                type="number"
                name="selling_price"
                value={product.selling_price}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Stock */}
          <label>Stock Quantity *</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleInputChange}
          />

          {/* Barcode */}
          <label>Barcode (Optional)</label>
          <div className="barcode-row">
            <input
              type="text"
              name="barcode"
              value={product.barcode}
              onChange={handleInputChange}
            />
            <button type="button" className="scan-btn">
              <FaBarcode /> Scan
            </button>
          </div>

          {/* Image */}
          <label>Product Image</label>
          <div className="upload-box">
            <FaCloudUploadAlt className="upload-icon" />
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <p className="upload-text">Drag and drop or click to upload</p>
            <small className="upload-subtext">png, jpg up to 5MB</small>
          </div>
        </div>

        {/* Preview Section */}
        <div className="preview-section">
          <div className="preview-box">
            {previewImage ? (
              <img
                src={encodeURI(previewImage)}
                alt="preview"
                className="preview-img"
              />
            ) : (
              <FaCamera className="camera-icon" />
            )}
          </div>

          <div className="preview-details">
            <h3>Product Preview</h3>
            {!previewImage && <p className="no-image">No image uploaded</p>}
            <div className="detail-row">
              <span>Purchase Price</span>
              <span>₹ {product.purchase_price || "0.00"}</span>
            </div>
            <div className="detail-row">
              <span>Selling Price</span>
              <span>₹ {product.selling_price || "0.00"}</span>
            </div>
            <div className="detail-row">
              <span>Stock Quantity</span>
              <span>{product.stock || 0} units</span>
            </div>
          </div>
        </div>
      </div>

      <div className="inventory-footer">
        <button className="cancel-btn" onClick={() => navigate("/Inventory")}>
          Cancel
        </button>
        <button className="save-btn" onClick={handleUpdate}>
          Update Product
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
