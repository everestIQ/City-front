import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

export default function AppNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" sticky="top" style={{ background: "#0b1b33", padding: "0.9rem 0" }}>
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold text-white"
          style={{ fontSize: "1.4rem", letterSpacing: "0.5px" }}
        >
          First City Bank
        </Navbar.Brand>

        {/* Desktop Nav Links */}
        <Nav className="ms-auto d-none d-lg-flex align-items-center">
          <Nav.Link as={Link} to="/" className="text-white me-3">Home</Nav.Link>
          <Nav.Link as={Link} to="/about" className="text-white me-3">About</Nav.Link>
          <Nav.Link as={Link} to="/contact" className="text-white me-3">Contact Us</Nav.Link>

          {/* Open Account Button */}
          {!token && (
            <Button
              as={Link}
              to="/register"
              variant="primary"
              className="px-4 fw-semibold"
              style={{ borderRadius: "8px" }}
            >
              Open Account
            </Button>
          )}

          {/* Dashboard If Logged In
          {token && role === "CUSTOMER" && (
            <Nav.Link as={Link} to="/dashboard" className="text-white me-3">Dashboard</Nav.Link>
          )} */}

          {/* Logout */}
          {token && (
            <Button variant="outline-light" className="px-4" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Nav>

        {/* Mobile Menu Dropdown - Premium Style */}
<Dropdown className="d-lg-none ms-auto pe-0">
  <Dropdown.Toggle
    variant="link"
    className="premium-menu-toggle text-white"
  >
    <FaBars />
  </Dropdown.Toggle>

  <Dropdown.Menu
    align="end"
    className="shadow border-0 py-3 rounded-3"
    style={{ minWidth: "190px", background: "#ffffff" }}
  >
    <Dropdown.Item as={Link} to="/">Home</Dropdown.Item>
    <Dropdown.Item as={Link} to="/about">About</Dropdown.Item>
    <Dropdown.Item as={Link} to="/contact">Contact Us</Dropdown.Item>

    {!token && (
      <>
        <Dropdown.Item as={Link} to="/login">Login</Dropdown.Item>
        <Dropdown.Item as={Link} to="/register" className="fw-semibold text-primary">Open Account</Dropdown.Item>
      </>
    )}

    {token && role === "CUSTOMER" && (
      <Dropdown.Item as={Link} to="/dashboard">Dashboard</Dropdown.Item>
    )}

    {token && (
      <Dropdown.Item onClick={handleLogout} className="text-danger fw-semibold">
        Logout
      </Dropdown.Item>
    )}
  </Dropdown.Menu>
</Dropdown>


      </Container>
    </Navbar>
  );
}
