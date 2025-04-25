import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [featuredMedicines, setFeaturedMedicines] = useState([]);
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

  useEffect(() => {
    const fetchFeaturedMedicines = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/medicines");
        setFeaturedMedicines(response.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching featured medicines:", error);
      }
    };
    fetchFeaturedMedicines();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleSelect = (medicineName) => {
    setSearchQuery(medicineName);
    navigate(`/search?q=${medicineName}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">MediStock</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/Cart">Cart</Link></li>
              <li className="nav-item"><Link className="btn btn-warning ms-2" to="/login">Login</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <header className="bg-light text-center py-5 border-bottom">
        <div className="container">
          <h1 className="display-5 fw-semibold">Manage Medicines with Confidence</h1>
          <p className="lead">Fast, Easy, and Reliable Inventory & Medicine Ordering</p>
          <div className="position-relative mx-auto" style={{ maxWidth: "600px" }}>
            <input type="text" className="form-control" placeholder="Search for medicines..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleKeyDown} />
            <button className="btn btn-primary mt-2 w-100" onClick={handleSearch}>Search</button>
            {suggestions.length > 0 && (
              <ul className="list-group position-absolute w-100 mt-1 shadow" style={{ zIndex: 10 }}>
                {suggestions.map((medicine, index) => (
                  <li key={index} className="list-group-item list-group-item-action" onClick={() => handleSelect(medicine.name)} style={{ cursor: "pointer" }}>{medicine.name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </header>

      <section className="container py-5">
        <h2 className="text-center mb-4 fw-bold">Featured Medicines</h2>
        <div className="row">
          {featuredMedicines.map((medicine) => (
            <div key={medicine._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img src={medicine.image || "https://via.placeholder.com/300x200"} className="card-img-top" alt={medicine.name} style={{ objectFit: "cover", height: "200px" }} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{medicine.name}</h5>
                  <p className="card-text">Price: ${medicine.price}</p>
                  <Link to={`/medicine/${medicine._id}`} className="btn btn-outline-primary mt-auto">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h2 className="mb-3">Exclusive Offers Just for You!</h2>
          <p>Flat 20% OFF on your first order. Hurry up!</p>
          <Link to="/offers" className="btn btn-light">Explore Offers</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;