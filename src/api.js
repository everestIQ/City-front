import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);

export const getDashboard = () => API.get("/dashboard");

export const deposit = (id, amount) =>
  API.post(`/transactions/${id}/deposit`, { amount });

export const withdraw = (id, amount) =>
  API.post(`/transactions/${id}/withdraw`, { amount });

export const transfer = (fromId, toId, amount) =>
  API.post(`/transactions/${fromId}/transfer/${toId}`, { amount });
