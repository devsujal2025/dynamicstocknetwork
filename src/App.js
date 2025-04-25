import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // ✅ Removed BrowserRouter as Router
import { useContext } from "react";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; // Import CartProvider once

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import Unauthorized from "./pages/Unauthorized";
import SearchResults from "./pages/SearchResults";
import CartPage from "./pages/CartPage"; // CartPage component
import Orders from "./pages/Orders"; // Orders component for orders page
import PaymentOptions from "./pages/PaymentOptions";

// Role-Based Protected Route
function ProtectedRoute({ element, allowedRoles }) {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (!user.role || !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return element;
}

function App() {
    return (
        <AuthProvider>
            <CartProvider> {/* CartProvider should wrap the entire app */}
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route path="/orders" element={<ProtectedRoute element={<Orders />} allowedRoles={["customer", "admin", "pharmacist"]} />} />
                    <Route path="/payment-options" element={<PaymentOptions />} /> {/* New route for payment options */}
					<Route
                        path="/dashboard/admin"
                        element={<ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />}
                    />
                    <Route
                        path="/dashboard/pharmacist"
                        element={<ProtectedRoute element={<PharmacistDashboard />} allowedRoles={["pharmacist", "admin"]} />}
                    />
                    <Route
                        path="/dashboard/customer"
                        element={<ProtectedRoute element={<CustomerDashboard />} allowedRoles={["customer", "admin", "pharmacist"]} />}
                    />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                </Routes>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
