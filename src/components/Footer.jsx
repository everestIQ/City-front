import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          {/* About */}
          <Col md={4} className="mb-3">
            <h5 className="fw-bold">First City Bank</h5>
            <p>
              Trusted partner in financial growth.  
              Secure, reliable, and customer-focused banking for everyone.
            </p>
          </Col>

          {/* Quick Links */}
          <Col md={4} className="mb-3">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/login" className="text-light text-decoration-none">Login</a></li>
              <li><a href="/register" className="text-light text-decoration-none">Register</a></li>
              <li><a href="/dashboard" className="text-light text-decoration-none">Dashboard</a></li>
            </ul>
          </Col>

          {/* Contact Info */}
          <Col md={4} className="mb-3">
            <h6 className="fw-bold">Contact Us</h6>
            <p>Email: support@firstcitybank.com</p>
            <p>Phone: +1 889445755 </p>
            <p>Address:  </p>
          </Col>
        </Row>

        <Row className="pt-3 border-top border-secondary mt-3">
          <Col className="text-center">
            <small>© {new Date().getFullYear()} First City Bank. All rights reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}