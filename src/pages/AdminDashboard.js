import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [medicines, setMedicines] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState("medicines"); // Toggle between "medicines" and "users"
    
    const [editUser, setEditUser] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({ name: "", email: "", role: "" });
    
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (view === "medicines") fetchMedicines();
        else fetchUsers();
    }, [view]);

    // Fetch Medicines
    const fetchMedicines = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/api/medicines", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMedicines(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load medicines.");
            setLoading(false);
        }
    };

    // Fetch Users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/api/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load users.");
            setLoading(false);
        }
    };

    // Delete User
    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await axios.delete(`http://localhost:5000/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(response.data.message);
            setUsers(users.filter(user => user._id !== userId));
        } catch (err) {
            alert("Error deleting user: " + (err.response?.data?.message || "Unknown error"));
        }
    };

    // Open Edit Modal
    const handleEdit = (user) => {
        setEditUser(user);
        setUpdatedUser({ name: user.name, email: user.email, role: user.role });
    };

    // Update User
    const updateUser = async () => {
        if (!editUser) return;

        try {
            const response = await axios.put(
                `http://localhost:5000/api/users/${editUser._id}`,
                updatedUser,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            alert(response.data.message);
            setUsers(users.map(user => user._id === editUser._id ? response.data.user : user));
            setEditUser(null);
        } catch (err) {
            alert("Error updating user: " + (err.response?.data?.message || "Unknown error"));
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Admin Dashboard</h2>
            
            <button onClick={() => setView("medicines")}>Manage Medicines</button>
            <button onClick={() => setView("users")}>Manage Users</button>

            {/* Medicines View */}
            {view === "medicines" && (
                <div>
                    <h3>Medicines</h3>
                    {medicines.length === 0 ? <p>No medicines found.</p> : (
                        <ul>
                            {medicines.map(medicine => (
                                <li key={medicine._id}>{medicine.name} - {medicine.expiryDate}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Users View */}
            {view === "users" && (
                <div>
                    <h3>Users</h3>
                    {users.length === 0 ? <p>No users found.</p> : (
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>
                                            
                                            <button onClick={() => deleteUser(user._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

           
        </div>
    );
};

export default AdminDashboard;
