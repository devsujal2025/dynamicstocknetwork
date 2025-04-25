import React from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        userId: user._id,
        items: cartItems,
        total: cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
      };

      await axios.post("http://localhost:5000/api/orders", orderData);
      alert("Order placed successfully!");

      clearCart(); // Optional: clear cart
      navigate("/orders"); // Navigate to orders page
    } catch (error) {
      console.error("Order placement failed:", error);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Confirm Your Order</h2>
      {cartItems.map((item, i) => (
        <div key={i} className="border-bottom py-2">
          <strong>{item.name}</strong> - ₹{item.price} x {item.quantity || 1}
        </div>
      ))}
      <h4 className="mt-3">Total: ₹{cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)}</h4>
      <button className="btn btn-success w-100 mt-4" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
}

export default Checkout;
