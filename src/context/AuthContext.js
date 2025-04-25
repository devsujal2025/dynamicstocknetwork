import { createContext, useState, useEffect } from "react";
import { loginUser, logoutUser } from "../services/authService";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 > Date.now()) {
                    return { token, role: decodedToken.role }; // ✅ Restore user
                }
            } catch (error) {
                console.error("❌ Invalid token:", error);
            }
        }
        return null;
    });

    // Function to logout user
    const logout = () => {
        logoutUser();
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("tokenExpiry");
        setUser(null);
    };

    // Function to check token expiration
    const checkTokenExpiration = () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    console.log("⚠️ Token expired, logging out.");
                    logout(); // Auto logout if expired
                }
            } catch (error) {
                console.error("❌ Token decoding failed:", error);
                logout(); // Logout if token is invalid
            }
        }
    };

    // Restore user on page load
    useEffect(() => {
        checkTokenExpiration();
        const interval = setInterval(checkTokenExpiration, 5 * 60 * 1000); // Every 5 min
        return () => clearInterval(interval);
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            const data = await loginUser(email, password);
            const decodedToken = jwtDecode(data.token);

            // Store user data
            const userData = { token: data.token, role: decodedToken.role };
            setUser(userData);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", decodedToken.role);
            localStorage.setItem("tokenExpiry", decodedToken.exp * 1000);

            return { success: true, role: decodedToken.role }; // Return for redirection
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
