import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaPiggyBank,
  FaUniversity,
  FaGlobe,
  FaShieldAlt,
  FaHeadset,
  FaMobileAlt,
  FaStar,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    image: "/users/user1.jpg",
    quote:
      "First City Bank made managing my business finances effortless. The online platform is intuitive and secure.",
  },
  {
    name: "David Miller",
    role: "Freelance Designer",
    image: "/users/user2.jpg",
    quote:
      "I got approved for a personal loan within minutes. Excellent service and responsive support team!",
  },
  {
    name: "Amina Yusuf",
    role: "Student",
    image: "/users/user3.jpg",
    quote:
      "Their mobile app is the best I've used. I can save, send, and monitor my expenses from anywhere.",
  },
];

export default function Home() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero text-center text-white d-flex align-items-center"
        style={{
          minHeight: "90vh",
          background:
            "linear-gradient(rgba(8, 12, 197, 0.8), rgba(14, 19, 83, 0.8)), url('/hero-banking.jpg') center/cover no-repeat",
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="display-3 fw-bold mb-3">Welcome to First City Bank</h1>
            <p className="lead mb-4">
              Experience seamless online banking built for your lifestyle — fast,
              secure, and innovative.
            </p>
            <div className="mt-4">
              <Button
                as={Link}
                to="/register"
                variant="light"
                size="lg"
                className="me-3 fw-semibold"
              >
                Get Started
              </Button>
              <Button as={Link} to="/login" variant="outline-light" size="lg">
                Login
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Services */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold text-primary">
            Our Core Services
          </h2>
          <Row>
            {[
              {
                icon: <FaPiggyBank className="text-primary" size={40} />,
                title: "Savings Accounts",
                text: "Grow your wealth with attractive interest rates and zero hidden fees.",
              },
              {
                icon: <FaUniversity className="text-success" size={40} />,
                title: "Loans & Credit",
                text: "Flexible loans designed around your lifestyle and needs.",
              },
              {
                icon: <FaGlobe className="text-warning" size={40} />,
                title: "Online Banking",
                text: "Manage your money securely anywhere in the world.",
              },
            ].map((service, i) => (
              <Col md={4} key={i} className="mb-4">
                <motion.div whileHover={{ y: -6 }}>
                  <Card className="h-100 shadow-sm border-0 glass-card text-center">
                    <Card.Body>
                      {service.icon}
                      <h4 className="fw-bold mt-3">{service.title}</h4>
                      <p className="text-muted">{service.text}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center mb-5 fw-bold text-primary">
            Why Choose First City Bank?
          </h2>
          <Row>
            {[
              {
                icon: <FaShieldAlt className="text-danger" size={40} />,
                title: "Bank-Level Security",
                text: "Your funds and data are encrypted and always protected.",
              },
              {
                icon: <FaHeadset className="text-info" size={40} />,
                title: "24/7 Support",
                text: "Always available whenever you need help.",
              },
              {
                icon: <FaMobileAlt className="text-primary" size={40} />,
                title: "Global Access",
                text: "Access your bank from any device, anywhere in the world.",
              },
            ].map((item, i) => (
              <Col md={4} key={i} className="mb-4 text-center">
                <motion.div whileHover={{ scale: 1.05 }}>
                  {item.icon}
                  <h5 className="fw-bold mt-3">{item.title}</h5>
                  <p className="text-muted">{item.text}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-5 bg-light">
        <Container className="text-center">
          <h2 className="fw-bold text-primary mb-5">What Our Customers Say</h2>
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src={testimonials[current].image}
              alt={testimonials[current].name}
              className="rounded-circle mb-4"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
            <p className="fst-italic mx-auto" style={{ maxWidth: "600px" }}>
              “{testimonials[current].quote}”
            </p>
            <h5 className="fw-bold mt-3">{testimonials[current].name}</h5>
            <p className="text-muted">{testimonials[current].role}</p>
          </motion.div>
        </Container>
      </section>

      {/* CTA */}
      <section
        className="py-5 text-center text-white"
        style={{
          background: "linear-gradient(90deg, #0a4cff, #0a2a8a)",
        }}
      >
        <Container>
          <h2 className="fw-bold mb-3">Join First City Bank Today</h2>
          <p className="mb-4">
            Open your account in minutes and enjoy a new level of digital banking.
          </p>
          <Button as={Link} to="/register" variant="light" size="lg" className="fw-semibold">
            Create an Account
          </Button>
        </Container>
      </section>

      {/* Styles */}
      <style>
        {`
          .glass-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(6px);
            border-radius: 15px;
            transition: all 0.3s ease;
          }
          .glass-card:hover {
            box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          }
          .hero h1 {
            letter-spacing: 1px;
          }
        `}
      </style>
    </div>
  );
}
