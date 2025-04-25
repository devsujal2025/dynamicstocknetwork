import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Orders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get("/api/orders/my", {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setOrders(res.data);
            } catch (err) {
                console.error("Failed to fetch orders:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.token) {
            fetchOrders();
        }
    }, [user]);

    if (loading) return <div className="p-4">Loading orders...</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">My Orders</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="border p-4 mb-4 rounded shadow">
                        <p><strong>Order ID:</strong> {order._id}</p>
                        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><strong>Status:</strong> {order.status || "Pending"}</p>
                        <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                        <h2 className="mt-2 font-semibold">Items:</h2>
                        <ul className="list-disc pl-6">
                            {order.items.map((item, idx) => (
                                <li key={idx}>
                                    {item.name} - ₹{item.price} × {item.quantity}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;
