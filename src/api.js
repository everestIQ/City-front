import axios from "axios";

// ✅ Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://city-server-6geb.onrender.com";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ✅ Add auth token to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ---------------- AUTH ----------------
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// ---------------- DASHBOARD ----------------
export const getDashboard = () => API.get("/dashboard");
export const deposit = (amount, referenceId) =>
  API.post("/dashboard/deposit", { amount, referenceId });
export const withdraw = (amount) =>
  API.post("/dashboard/withdraw", { amount });
export const transfer = (payload) =>
  API.post("/dashboard/transfer", payload);

// ---------------- EXPORT ----------------
export default API;
