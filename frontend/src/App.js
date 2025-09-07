import "./App.css";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NewBill from "./pages/Newbill";
import BillPreview from "./pages/Billpreview";
import AddProduct from "./pages/AddProduct";
import Subscription from "./pages/Subscription";
import Settings from "./pages/Settings";
import BillsAndDuesPage from "./pages/BillsAndDuesPage";
import Reports from "./pages/Reports";
import InventoryManagement from "./pages/InventoryManagement";
import EditProduct from "./pages/EditProduct";
import EditBill from "./pages/EditBill";

function App() {
  return (
    <div className="App" style={{ display: "flex" }}>
      <BrowserRouter>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/NewBill" element={<NewBill />} />
          <Route path="/BillPreview" element={<BillPreview />} />
          <Route path="/Inventory" element={<InventoryManagement />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/Subscription" element={<Subscription />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/Bills" element={<BillsAndDuesPage />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/EditProduct/:id" element={<EditProduct />} />
          <Route path="/EditBill" element={<EditBill />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
