import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart() {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    const [showPaymentOptions, setShowPaymentOptions] = useState(false); // ✅ NEW STATE
    const [selectedPayment, setSelectedPayment] = useState(""); // ✅ SELECTED METHOD

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

    const handlePlaceOrder = async () => {
        const userId = localStorage.getItem("userId");
        const items = cartItems.map(item => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price
        }));
        const totalAmount = getTotal();

        try {
            const response = await axios.post('/api/orders/place-order', { userId, items, totalAmount });

            if (response.data.success) {
                // ✅ Show payment options instead of navigating immediately
                setShowPaymentOptions(true);
            } else {
                alert("Order placement failed, please try again.");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("There was an error placing your order. Please try again.");
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
                        <button className="btn btn-success mt-2" onClick={handlePlaceOrder}>Place Order</button>

                        {/* ✅ Payment Options Section */}
                        {showPaymentOptions && (
                            <div className="mt-4">
                                <h5>Select Payment Method:</h5>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="paymentMethod" id="cod" value="Cash on Delivery"
                                        checked={selectedPayment === "Cash on Delivery"}
                                        onChange={(e) => setSelectedPayment(e.target.value)} />
                                    <label className="form-check-label" htmlFor="cod">
                                        Cash on Delivery
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="paymentMethod" id="upi" value="UPI"
                                        checked={selectedPayment === "UPI"}
                                        onChange={(e) => setSelectedPayment(e.target.value)} />
                                    <label className="form-check-label" htmlFor="upi">
                                        UPI
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" name="paymentMethod" id="card" value="Credit/Debit Card"
                                        checked={selectedPayment === "Credit/Debit Card"}
                                        onChange={(e) => setSelectedPayment(e.target.value)} />
                                    <label className="form-check-label" htmlFor="card">
                                        Credit/Debit Card
                                    </label>
                                </div>

                                <button className="btn btn-primary mt-3" disabled={!selectedPayment}>
                                    Confirm Payment
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
