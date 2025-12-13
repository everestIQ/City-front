import axios from "axios";

const API = axios.create({
  baseURL: "https://city-server-6geb.onrender.com",
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// AUTH
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

// DASHBOARD
export const getDashboard = () => API.get("/dashboard");

// TRANSACTIONS
export const deposit = (id, amount) =>
  API.post(`/transactions/${id}/deposit`, { amount });

export const withdraw = (id, amount) =>
  API.post(`/transactions/${id}/withdraw`, { amount });

export const transfer = (fromId, toId, amount) =>
  API.post(`/transactions/${fromId}/transfer/${toId}`, { amount });

export default API;
