import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert
} from "react-bootstrap";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";
import axios from "axios";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [alert, setAlert] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/contact", form);
      setAlert({ type: "success", text: "Message sent successfully!" });
    } catch (err) {
      setAlert({ type: "danger", text: "Failed to send message" });
    }
  };

  return (
    <div style={{ background: "#f7f9fc" }}>
      {/* HERO SECTION */}
      <section
        className="text-white text-center d-flex align-items-center"
        style={{
          background: "linear-gradient(90deg, #0b64e1, #073a9b)",
          minHeight: "30vh",
        }}
      >
        <Container>
          <h1 className="display-6 fw-bold">Contact Us</h1>
          <p className="lead mt-2">We’re here to help you anytime</p>
        </Container>
      </section>

      <Container className="py-5">
        <Row className="justify-content-center g-4">
          {/* CONTACT FORM */}
          <Col lg={7} md={8}>
            <Card className="shadow-sm border-0 p-4">
              <h3 className="fw-bold mb-3" style={{ color: "#0b1b33" }}>
                Send Us a Message
              </h3>

              {alert && <Alert variant={alert.type}>{alert.text}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Your Message</Form.Label>
                  <Form.Control
                    name="message"
                    as="textarea"
                    rows={4}
                    placeholder="Type your message..."
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="px-4 fw-semibold"
                  style={{ borderRadius: "8px" }}
                >
                  Send Message
                </Button>
              </Form>
            </Card>
          </Col>

          {/* CONTACT INFO */}
          <Col lg={5} md={8}>
            <Card
              className="shadow-sm border-0 p-4 text-white"
              style={{
                background: "linear-gradient(180deg, #0b64e1, #073a9b)",
                borderRadius: "12px",
              }}
            >
              <h4 className="fw-bold mb-4">Get in Touch</h4>

              <div className="d-flex mb-4">
                <FaMapMarkerAlt size={28} className="me-3" />
                <div>
                  <h6 className="fw-bold">Office Address</h6>
                  <p className="mb-0">123 Finance Avenue, Abuja, Nigeria</p>
                </div>
              </div>

              <div className="d-flex mb-4">
                <FaPhoneAlt size={28} className="me-3" />
                <div>
                  <h6 className="fw-bold">Phone</h6>
                  <p className="mb-0">+234 800 123 4567</p>
                </div>
              </div>

              <div className="d-flex mb-3">
                <FaEnvelope size={28} className="me-3" />
                <div>
                  <h6 className="fw-bold">Email</h6>
                  <p className="mb-0">support@firstcitybank.com</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
