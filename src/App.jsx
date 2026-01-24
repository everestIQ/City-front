import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AppNavbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Services from "./pages/Services.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { getAuthData, saveAuthData } from "./utils/auth.js";

// ✅ Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout({ loading, suspensionMessage }) {
  const location = useLocation();
  const hideFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="d-flex flex-column min-vh-100 position-relative">
      <AppNavbar />

      {/* 🔴 Suspension banner */}
      {suspensionMessage && (
        <div className="alert alert-danger text-center m-0 rounded-0">
          {suspensionMessage}
        </div>
      )}

      {/* 🔄 Global loading bar */}
      {loading && (
        <div className="text-center py-2 bg-light small">
          Processing request…
        </div>
      )}

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/admin-login" element={<AdminLogin />} />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(false);
  const [suspensionMessage, setSuspensionMessage] = useState(null);

  // ✅ Restore auth on refresh
  useEffect(() => {
    const auth = getAuthData();
    if (auth?.token && auth?.user) {
      saveAuthData(auth.token, auth.user);
    }
  }, []);

  // ✅ Listen for API loading events
  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);

    window.addEventListener("api:loading:start", start);
    window.addEventListener("api:loading:end", end);

    return () => {
      window.removeEventListener("api:loading:start", start);
      window.removeEventListener("api:loading:end", end);
    };
  }, []);

  // 🔴 Listen for suspended account
  useEffect(() => {
    const handler = (e) => {
      setSuspensionMessage(e.detail.message);
      toast.error(e.detail.message);
    };

    window.addEventListener("account:suspended", handler);
    return () => window.removeEventListener("account:suspended", handler);
  }, []);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Layout loading={loading} suspensionMessage={suspensionMessage} />
    </Router>
  );
}

export default App;
