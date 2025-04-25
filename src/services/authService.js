import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:5000/api/auth"; // Update with your backend URL

export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Login failed");

        if (!data.token || !data.role) throw new Error("Invalid server response: Token or Role missing");

        const decodedToken = jwtDecode(data.token);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("tokenExpiry", decodedToken.exp * 1000);

        return data;
    } catch (error) {
        console.error("❌ Login Error:", error);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Registration failed");

        return data;
    } catch (error) {
        console.error("❌ Registration Error:", error);
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("tokenExpiry");
};

// Auto Logout if Token Expired
export const isTokenValid = () => {
    const expiry = localStorage.getItem("tokenExpiry");
    return expiry && new Date().getTime() < expiry;
};

export const getUserRole = () => localStorage.getItem("role");
