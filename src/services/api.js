import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const loginUser = async (email, password) => {
  return axios.post(`${API_URL}/auth/login`, { email, password });
};
