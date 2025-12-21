import axios from "axios";

// ✅ Base URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://city-server-6geb.onrender.com";

// ✅ Create axios instance
const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ✅ Request interceptor (auth token)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🔄 Notify app that a request started
    window.dispatchEvent(new Event("api:loading:start"));

    return config;
  },
  (error) => {
    window.dispatchEvent(new Event("api:loading:end"));
    return Promise.reject(error);
  }
);

// ✅ Response interceptor
API.interceptors.response.use(
  (response) => {
    window.dispatchEvent(new Event("api:loading:end"));
    return response;
  },
  (error) => {
    window.dispatchEvent(new Event("api:loading:end"));
    return Promise.reject(error);
  }
);

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
