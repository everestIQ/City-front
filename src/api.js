import axios from "axios";

// Backend base URL
const API = axios.create({
  baseURL: "http://localhost:5000", // change if deploying
});

// Automatically attach token (if available) to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// === AUTH ===
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// === DASHBOARD ===
export const getDashboard = () => API.get("/dashboard");

// === TRANSACTIONS ===
export const deposit = (accountId, amount) =>
  API.post(`/transactions/${accountId}/deposit`, { amount });

export const withdraw = (accountId, amount) =>
  API.post(`/transactions/${accountId}/withdraw`, { amount });

export const transfer = (fromId, toId, amount) =>
  API.post(`/transactions/${fromId}/transfer/${toId}`, { amount });
