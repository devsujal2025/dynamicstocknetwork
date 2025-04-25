import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

function SearchResults() {
  const [medicines, setMedicines] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();

  // Extract query from URL
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");

  // Fetch medicines based on search query
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/search?q=${query}`);
        setMedicines(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Failed to load search results.");
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Search Results for "{query}"</h2>

      {error && <p className="alert alert-danger">{error}</p>}

      {medicines.length > 0 ? (
        <div className="row">
          {medicines.map((medicine) => (
            <div key={medicine._id} className="col-md-3 mb-4">
              <div className="card shadow">
                <img src="https://via.placeholder.com/150" alt={medicine.name} className="card-img-top" />
                <div className="card-body text-center">
                  <h5 className="card-title">{medicine.name}</h5>
                  <p className="card-text">Price: ${medicine.price}</p>
                  <Link to={`/medicine/${medicine._id}`} className="btn btn-primary">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center mt-4">No medicines found.</p>
      )}
    </div>
  );
}

export default SearchResults;
