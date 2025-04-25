import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Modal, Input, notification } from "antd";

const API_URL = "http://localhost:5000/api";

const PharmacistDashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [newMedicine, setNewMedicine] = useState({ name: "", price: "", expiryDate: "", stock: "" });
  const [searchText, setSearchText] = useState("");
  const currencySymbol = "₹"; // Set currency symbol to Indian Rupees

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get(`${API_URL}/medicines`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMedicines(response.data);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNewMedicine({ ...newMedicine, [e.target.name]: e.target.value });
  };

  const handleUpdateChange = (e) => {
    setSelectedMedicine({ ...selectedMedicine, [e.target.name]: e.target.value });
  };

  const addMedicine = async () => {
    try {
      await axios.post(`${API_URL}/medicines`, newMedicine, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      notification.success({ message: "Medicine added successfully!" });
      fetchMedicines();
      setIsModalVisible(false);
      setNewMedicine({ name: "", price: "", expiryDate: "", stock: "" });
    } catch (error) {
      notification.error({ message: "Failed to add medicine!" });
      console.error(error);
    }
  };

  const deleteMedicine = async (id) => {
    try {
      await axios.delete(`${API_URL}/medicines/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      notification.success({ message: "Medicine deleted!" });
      fetchMedicines();
    } catch (error) {
      notification.error({ message: "Failed to delete medicine!" });
      console.error(error);
    }
  };

  const updateMedicine = async () => {
    try {
      await axios.put(`${API_URL}/medicines/${selectedMedicine._id}`, selectedMedicine, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      notification.success({ message: "Medicine updated successfully!" });
      fetchMedicines();
      setIsUpdateModalVisible(false);
      setSelectedMedicine(null);
    } catch (error) {
      notification.error({ message: "Failed to update medicine!" });
      console.error(error);
    }
  };

  const handleSearch = () => {
    if (!searchText) {
      fetchMedicines();
    } else {
      const filtered = medicines.filter((med) =>
        med.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setMedicines(filtered);
    }
  };

  const getExpiryAlerts = () => {
    const today = new Date();
    return medicines.filter((med) => new Date(med.expiryDate) < today);
  };

  const getLowStockAlerts = () => {
    return medicines.filter((med) => parseInt(med.stock) <= 5);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pharmacist Dashboard</h2>

      {/* Search Panel */}
      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <Input
          placeholder="Search Medicine"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "300px" }}
        />
        <Button type="primary" onClick={handleSearch}>🔍 Search</Button>
        <Button onClick={fetchMedicines}>🔄 Reset</Button>
      </div>

      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: "10px" }}>
        ➕ Add New Medicine
      </Button>

      <Table
        dataSource={medicines}
        rowKey="_id"
        loading={loading}
        columns={[
          { title: "Name", dataIndex: "name", key: "name" },
          {
            title: "Price",
            dataIndex: "price",
            key: "price",
            render: (price) => `${currencySymbol} ${price}`, // Display price with INR symbol
          },
          { title: "Stock", dataIndex: "stock", key: "stock" },
          { title: "Expiry Date", dataIndex: "expiryDate", key: "expiryDate" },
          {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
              <>
                <Button
                  type="link"
                  onClick={() => {
                    setSelectedMedicine({ ...record });
                    setIsUpdateModalVisible(true);
                  }}
                >
                  ✏️ Update
                </Button>
                <Button type="link" danger onClick={() => deleteMedicine(record._id)}>
                  ❌ Delete
                </Button>
              </>
            ),
          },
        ]}
      />

      {/* Expired Medicines Alert */}
      {getExpiryAlerts().length > 0 && (
        <div style={{ marginTop: "20px", padding: "10px", background: "#ffcccc", borderRadius: "5px" }}>
          <h3>⚠️ Expired Medicines</h3>
          {getExpiryAlerts().map((med) => (
            <p key={med._id}>{med.name} expired on {med.expiryDate}</p>
          ))}
        </div>
      )}

      {/* Low Stock Alert */}
      {getLowStockAlerts().length > 0 && (
        <div style={{ marginTop: "20px", padding: "10px", background: "#fff3cd", borderRadius: "5px" }}>
          <h3>⚠️ Low Stock Warning</h3>
          {getLowStockAlerts().map((med) => (
            <p key={med._id}>{med.name} - Only {med.stock} left</p>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        title="Add New Medicine"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={addMedicine}
      >
        <Input placeholder="Name" name="name" value={newMedicine.name} onChange={handleChange} style={{ marginBottom: "10px" }} />
        <Input placeholder="Price" name="price" value={newMedicine.price} onChange={handleChange} style={{ marginBottom: "10px" }} />
        <Input placeholder="Stock" name="stock" value={newMedicine.stock} onChange={handleChange} style={{ marginBottom: "10px" }} />
        <Input placeholder="Expiry Date (YYYY-MM-DD)" name="expiryDate" value={newMedicine.expiryDate} onChange={handleChange} />
      </Modal>

      {/* Update Modal */}
      <Modal
        title="Update Medicine"
        open={isUpdateModalVisible}
        onCancel={() => setIsUpdateModalVisible(false)}
        onOk={updateMedicine}
      >
        <Input placeholder="Name" name="name" value={selectedMedicine?.name || ""} onChange={handleUpdateChange} style={{ marginBottom: "10px" }} />
        <Input placeholder="Price" name="price" value={selectedMedicine?.price || ""} onChange={handleUpdateChange} style={{ marginBottom: "10px" }} />
        <Input placeholder="Stock" name="stock" value={selectedMedicine?.stock || ""} onChange={handleUpdateChange} style={{ marginBottom: "10px" }} />
        <Input placeholder="Expiry Date (YYYY-MM-DD)" name="expiryDate" value={selectedMedicine?.expiryDate || ""} onChange={handleUpdateChange} />
      </Modal>
    </div>
  );
};

export default PharmacistDashboard;
