import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
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

function Layout() {
  const location = useLocation();

  // Hide footer on login and register
  const hideFooter = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protect customer + admin dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Protect admin dashboard (only admins) */}
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
  useEffect(() => {
    const auth = getAuthData();
    if (auth?.token && auth?.user) {
      // re-init logout timer after page reload
      saveAuthData(auth.token, auth.user);
    }
  }, []);

  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
