import axios from "axios";

const API_URL = "https://dynamicstock-backend.onrender.com/api/auth";

export const loginUser = async (email, password) => {
  return axios.post(`${API_URL}/auth/login`, { email, password });
};
