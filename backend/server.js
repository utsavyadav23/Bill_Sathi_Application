require("dotenv").config();
const express = require("express");
const cors = require("cors");

const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const planRoutes = require("./routes/planRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
