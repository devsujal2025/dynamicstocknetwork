import axios from "axios";
import React, { useState, useEffect } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <h3>Order #{order._id}</h3>
              <ul>
                {order.items.map((item) => (
                  <li key={item.medicineId._id}>
                    {item.medicineId.name} - Quantity: {item.quantity} - Price: ${item.price}
                  </li>
                ))}
              </ul>
              <p>Total: ${order.total}</p>
              <p>Status: {order.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
