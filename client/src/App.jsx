
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AddEquipment from "./pages/owner/AddEquipment";
import MyEquipments from "./pages/owner/MyEquipments";
import EditEquipment from "./pages/owner/EditEquipment";
import OwnerBookings from "./pages/owner/OwnerBookings";
import BrowseEquipments from "./pages/farmer/BrowseEquipments";
import MyBookings from "./pages/farmer/MyBookings";
import HowItWorks from "./pages/HowItWorks";

function App() {
  return (
    <div className="relative min-h-screen bg-green-900">

      {/* Navbar */}
      <Navbar />
      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/equipments" element={
          <ProtectedRoute role="farmer">
            <BrowseEquipments />
          </ProtectedRoute>
        } />
        <Route path="/categories" element={<div className="pt-24 text-white text-center">Categories</div>} />
        <Route path="/about" element={<div className="pt-24 text-white text-center">About</div>} />
        <Route path="/contact" element={<div className="pt-24 text-white text-center">Contact</div>} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route
          path="/my-equipments"
          element={
            <ProtectedRoute role="owner">
              <MyEquipments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-equipment"
          element={
            <ProtectedRoute role="owner">
              <AddEquipment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-equipment/:id"
          element={
            <ProtectedRoute role="owner">
              <EditEquipment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking-requests"
          element={
            <ProtectedRoute role="owner">
              <OwnerBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute role="farmer">
              <MyBookings />
            </ProtectedRoute>
          }
        />
      </Routes>

    </div>
  );
}

export default App;
