// src/components/SearchBar.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SearchBar() {
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

  return (
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
  );
}

export default SearchBar;
