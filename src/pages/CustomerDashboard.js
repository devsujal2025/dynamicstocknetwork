import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; // ✅ Import cart context
import "bootstrap/dist/css/bootstrap.min.css";

function CustomerDashboard() {
  const { user } = useContext(AuthContext);
  const { addToCart } = useCart(); // ✅ Use cart context
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/search?q=${searchQuery}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSelect = (medicineName) => {
    setSearchQuery(medicineName);
    navigate(`/search?q=${medicineName}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  // ✅ Client-side cart handler using context
  const handleAddToCart = (medicine) => {
    if (!medicine) return;
    addToCart(medicine);
    alert(`${medicine.name} added to cart!`);
  };

  const featuredMedicines = [
    { name: "Ibuprofen", desc: "Pain relief, inflammation, and fever.", price: 150, img: "medicine1.jpg" },
    { name: "Paracetamol", desc: "Reduces fever and mild pain.", price: 50, img: "medicine2.jpg" },
    { name: "Amoxicillin", desc: "Antibiotic for bacterial infections.", price: 200, img: "medicine3.jpg" },
    { name: "Antihistamines", desc: "Used for allergy relief.", price: 120, img: "medicine4.jpg" },
    { name: "Cough Syrup", desc: "Relieves coughing and throat irritation.", price: 80, img: "medicine5.jpg" },
    { name: "Antacids", desc: "Neutralizes stomach acid for heartburn relief.", price: 60, img: "medicine6.jpg" },
    { name: "Insulin", desc: "Used to manage diabetes.", price: 250, img: "logo192.png" },
    { name: "Anti-Inflammatory", desc: "Reduces inflammation in the body.", price: 180, img: "medicine8.jpg" },
    { name: "Vitamins", desc: "Supplements for health and wellness.", price: 100, img: "medicine9.jpg" },
  ];

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">Customer Dashboard</Link>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/cart">Cart</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/orders">Orders</Link></li>
              <li className="nav-item"><Link className="btn btn-danger ms-2" to="/logout">Logout</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <header className="bg-light text-center py-4">
        <div className="container">
          <h2>Welcome, {user?.name || "Customer"}!</h2>
          <p>Find and order your medicines easily.</p>

          <div className="position-relative w-50 mx-auto">
            <input
              type="text"
              className="form-control"
              placeholder="Search for medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn btn-primary mt-2" onClick={() => navigate(`/search?q=${searchQuery}`)}>
              Search
            </button>
            {suggestions.length > 0 && (
              <ul className="list-group position-absolute w-100 mt-1 shadow">
                {suggestions.map((medicine, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSelect(medicine.name)}
                    style={{ cursor: "pointer" }}
                  >
                    {medicine.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="container mt-5">
            <h3>Featured Medicines</h3>
            <div className="row">
              {featuredMedicines.map((med, idx) => (
                <div className="col-12 col-md-4 mb-4" key={idx}>
                  <div className="card">
                    <img
                      src={`/images/medicines/${med.img}`}
                      className="card-img-top"
                      alt={med.name}
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{med.name}</h5>
                      <p className="card-text">{med.desc}</p>
                      <button
                        className="btn btn-success"
                        onClick={() => handleAddToCart(med)} // ✅ Pass whole object
                      >
                        Add to Cart (₹ {med.price})
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default CustomerDashboard;
