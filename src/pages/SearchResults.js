import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";

function SearchResults() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ✅ optional error state
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");

  const { addToCart } = useCart(); // ✅ cart context hook

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setError(null); // reset previous error
        setLoading(true);
        const response = await axios.get(`https://dynamicstock-backend.onrender.com/api/search?q=${query}`);

        setMedicines(response.data || []);
      } catch (err) {
        console.error("Error fetching medicines:", err);
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchMedicines();
    }
  }, [query]);

  const handleAddToCart = (medicine) => {
    if (!medicine) return;
    addToCart(medicine);
    alert(`${medicine.name} added to cart!`);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">
        Search Results for "<strong>{query}</strong>"
      </h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : medicines.length > 0 ? (
        <div className="row">
          {medicines.map((medicine) => (
            <div key={medicine._id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={medicine.image || "https://via.placeholder.com/300x200"}
                  className="card-img-top"
                  alt={medicine.name}
                  style={{ objectFit: "cover", height: "200px" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{medicine.name}</h5>
                  <p className="card-text text-muted mb-2">Price: ₹{medicine.price}</p>
                  <p className="card-text">{medicine.description?.slice(0, 100) || "No description available"}</p>
                  <button
                    className="btn btn-success mt-auto"
                    onClick={() => handleAddToCart(medicine)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-danger">No medicines found.</p>
      )}
    </div>
  );
}

export default SearchResults;
