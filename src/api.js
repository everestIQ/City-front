import axios from "axios";

// Determine backend URL (production or local)
const baseURL =
  import.meta.env.VITE_API_URL?.trim() ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://city-server-6geb.onrender.com");

// Create Axios instance
const API = axios.create({
  baseURL,
  withCredentials: true,
});

// Auto-attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ==== AUTH ====
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// ==== DASHBOARD ====
export const getDashboard = () => API.get("/dashboard");

// ==== TRANSACTIONS ====
export const deposit = (id, amount) =>
  API.post(`/transactions/${id}/deposit`, { amount });

export const withdraw = (id, amount) =>
  API.post(`/transactions/${id}/withdraw`, { amount });

export const transfer = (fromId, toId, amount) =>
  API.post(`/transactions/${fromId}/transfer/${toId}`, { amount });

export default API;
