// src/pages/Cart.js
import React from "react";
import { useCart } from "../context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const getTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleIncrement = (item) => {
    updateQuantity(item._id, item.quantity + 1);
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item._id, item.quantity - 1);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-muted">Your cart is empty.</p>
      ) : (
        <>
          <div className="row">
            {cartItems.map((item) => (
              <div key={item._id} className="col-md-6 mb-4">
                <div className="card shadow-sm">
                  <div className="row g-0">
                    <div className="col-md-4">
                      <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="img-fluid rounded-start"
                        style={{ height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text text-muted">₹{item.price} each</p>
                        <div className="d-flex align-items-center">
                          <button className="btn btn-outline-secondary btn-sm me-2" onClick={() => handleDecrement(item)}>-</button>
                          <span>{item.quantity}</span>
                          <button className="btn btn-outline-secondary btn-sm ms-2" onClick={() => handleIncrement(item)}>+</button>
                        </div>
                        <button className="btn btn-danger btn-sm mt-3" onClick={() => removeFromCart(item._id)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card p-4 mt-4">
            <h4>Total: ₹{getTotal()}</h4>
            <button className="btn btn-success mt-2">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
