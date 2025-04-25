import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart() {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();
    const [showPaymentOptions, setShowPaymentOptions] = useState(false); // NEW STATE for payment options
    const [selectedPayment, setSelectedPayment] = useState(""); // SELECTED PAYMENT METHOD
    const [loading, setLoading] = useState(false); // LOADING STATE for button disable
    const [error, setError] = useState(""); // ERROR STATE

    const API_URL = process.env.REACT_APP_API_URL || "https://dynamicstock-backend.onrender.com/api";

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
        setLoading(true); // Enable loading state
        const userId = localStorage.getItem("userId");
        const items = cartItems.map(item => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price
        }));
        const totalAmount = getTotal();

        try {
            const response = await axios.post(`${API_URL}/orders/place-order`, { userId, items, totalAmount });

            if (response.data.success) {
                // Show payment options after placing the order
                setShowPaymentOptions(true);
            } else {
                setError("Order placement failed, please try again.");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            setError("There was an error placing your order. Please try again.");
        }
        setLoading(false); // Disable loading state
    };

    const handlePayment = async () => {
        if (!selectedPayment) {
            alert("Please select a payment method.");
            return;
        }

        const paymentDetails = {
            method: selectedPayment,
            orderId: "12345", // Assume order ID is generated on the backend after placing the order
            amount: getTotal(),
        };

        try {
            // Send payment details to backend (adjust as per your actual backend endpoint)
            const paymentResponse = await axios.post(`${API_URL}/payment/confirm`, paymentDetails);

            if (paymentResponse.data.success) {
                alert("Payment successful! Your order is being processed.");
                navigate("/order-confirmation"); // Redirect to order confirmation page
            } else {
                alert("Payment failed. Please try again.");
            }
        } catch (error) {
            console.error("Payment Error:", error);
            alert("There was an error processing the payment. Please try again.");
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
                        <button className="btn btn-success mt-2" onClick={handlePlaceOrder} disabled={loading}>
                            {loading ? "Placing Order..." : "Place Order"}
                        </button>

                        {/* Payment Options Section */}
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

                                <button className="btn btn-primary mt-3" disabled={!selectedPayment} onClick={handlePayment}>
                                    Confirm Payment
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Display error if any */}
            {error && <p className="alert alert-danger">{error}</p>}
        </div>
    );
}

export default Cart;
