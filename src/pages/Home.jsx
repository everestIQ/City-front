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
  FaClipboardCheck,
  FaFileSignature,
  FaMoneyBillWave,
  FaSmileBeam,
  FaLock,
  FaCloud,
  FaCreditCard,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    image:
      "https://res.cloudinary.com/dwn7zhys5/image/upload/q_auto,f_auto,w_200//v1765824864/user1_mvbpfl.jpg",
    quote:
      "First City Bank made managing my business finances effortless.",
  },
  {
    name: "David Miller",
    role: "Freelance Designer",
    image:
      "https://res.cloudinary.com/dwn7zhys5/image/upload/v1765824864/user2_2_envmx9.jpg",
    quote:
      "I got approved for a personal loan within minutes.",
  },
  {
    name: "John Lee",
    role: "Engineer",
    image:
      "https://res.cloudinary.com/dwn7zhys5/image/upload/v1765824864/user3_buzpvi.jpg",
    quote:
      "Their mobile app is the best I've used.",
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
            "linear-gradient(rgba(8, 12, 197, 0.8), rgba(14, 19, 83, 0.8)), url('https://res.cloudinary.com/dwn7zhys5/image/upload/v1766313539/hero-banking_um91no.jpg') center/cover no-repeat",
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="display-3 fw-bold mb-3">Welcome to First City Bank</h1>
            <p className="lead mb-4">
              Experience seamless online banking built for your lifestyle — fast,
              secure, and innovative.
            </p>
            <motion.div
              className="mt-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
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
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* Core Services */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold text-primary">Our Core Services</h2>
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
                <motion.div whileHover={{ y: -10, scale: 1.05 }}>
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

      {/* 🆕 Digital Banking Experience */}
      <section className="py-5 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          <motion.img
            src="https://res.cloudinary.com/dwn7zhys5/image/upload/v1766313350/digital-banking_oecsuo.jpg"
            alt="Digital Banking Experience"
            className="w-full md:w-1/2 rounded-3xl shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">
              Next-Level Digital Banking Experience
            </h2>
            <p className="text-muted mb-4">
              From mobile deposits to instant transfers, First City Bank provides
              the tools you need to stay in control of your finances — anywhere,
              anytime.
            </p>
            <ul className="space-y-3 text-gray-600">
              <li>✔ Real-time transaction alerts</li>
              <li>✔ Seamless account linking</li>
              <li>✔ 24/7 secure mobile access</li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold text-primary">Why Choose First City Bank?</h2>
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
                <motion.div whileHover={{ scale: 1.1 }}>
                  {item.icon}
                  <h5 className="fw-bold mt-3">{item.title}</h5>
                  <p className="text-muted">{item.text}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 🆕 Security & Trust (Corporate theme + parallax ready) */}
<section className="relative py-20 bg-white overflow-hidden">
  {/* Parallax Background */}
  <motion.div
    className="absolute inset-0 bg-fixed bg-center bg-cover opacity-10"
    style={{
      backgroundImage: "url('/security-bg.jpg')",
    }}
    initial={{ backgroundPositionY: "0%" }}
    whileInView={{ backgroundPositionY: "50%" }}
    transition={{ duration: 2, ease: "easeInOut" }}
  ></motion.div>

  {/* Content */}
  <div className="relative container mx-auto px-6 text-center">
    <motion.h2
      className="text-4xl font-bold text-primary mb-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      Built on Trust & Security
    </motion.h2>

    <p className="text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
      At First City Bank, your trust is our foundation. We employ advanced
      encryption, AI-powered fraud detection, and continuous system monitoring
      to keep your money and information safe — day and night.
    </p>

    {/* Features */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
      {[
        {
          icon: <FaShieldAlt className="text-blue-600" size={45} />,
          title: "Bank-Grade Encryption",
          desc: "We protect your data with cutting-edge 256-bit encryption technology.",
        },
        {
          icon: <FaCloud className="text-indigo-600" size={45} />,
          title: "Secure Cloud Backup",
          desc: "Your financial records are safely stored and instantly recoverable.",
        },
        {
          icon: <FaLock className="text-blue-700" size={45} />,
          title: "24/7 Monitoring",
          desc: "Real-time fraud detection ensures suspicious activity never goes unchecked.",
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300"
          whileHover={{ y: -8, scale: 1.03 }}
        >
          <div className="flex justify-center mb-4">{item.icon}</div>
          <h5 className="font-semibold text-gray-800 mb-2">{item.title}</h5>
          <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Loan Process (your existing one) */}
        {/* Loan Process Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5 fw-bold text-primary">
            How to Get a Loan in 4 Easy Steps
          </h2>
          <Row className="text-center">
            {[
              {
                icon: <FaClipboardCheck className="text-primary" size={40} />,
                title: "1. Apply Online",
                text: "Fill out a simple online loan application in minutes.",
              },
              {
                icon: <FaFileSignature className="text-success" size={40} />,
                title: "2. Submit Documents",
                text: "Upload your ID and proof of income for quick verification.",
              },
              {
                icon: <FaMoneyBillWave className="text-warning" size={40} />,
                title: "3. Get Approved",
                text: "Receive loan approval and terms instantly after review.",
              },
              {
                icon: <FaSmileBeam className="text-info" size={40} />,
                title: "4. Receive Funds",
                text: "Money is credited directly to your account — fast and secure.",
              },
            ].map((step, i) => (
              <Col md={3} sm={6} key={i} className="mb-4">
                <motion.div whileHover={{ y: -5 }}>
                  <Card className="h-100 shadow-sm border-0 glass-card">
                    <Card.Body>
                      {step.icon}
                      <h5 className="fw-bold mt-3">{step.title}</h5>
                      <p className="text-muted">{step.text}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      {/* Mobile Banking App Showcase */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">
              Manage Everything on the Go
            </h2>
            <p className="text-gray-600 mb-4">
              Our mobile app gives you total control of your finances. Transfer funds,
              track spending, and manage your cards with a few taps.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>📱 Instant balance checks</li>
              <li>💳 Secure card management</li>
              <li>🌍 24/7 global access</li>
            </ul>
          </motion.div>
          <motion.div
            className="relative md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="https://res.cloudinary.com/dwn7zhys5/image/upload/v1766311220/images_1_n1llqz.jpg"
              alt="Mobile Banking App"
              className="w-full rounded-3xl shadow-xl"
            />
          </motion.div>
        </div>
      </section>

{/* Testimonials */}
<section className="py-5 bg-light">
  <Container className="text-center">
    <h2 className="fw-bold text-primary mb-2">What Our Customers Say</h2>
    <p className="text-muted mb-5">
      Real stories from people who trust First City Bank every day
    </p>

    <motion.div
      key={current}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mx-auto"
      style={{ maxWidth: "700px" }}
    >
      <div className="bg-white p-4 rounded-4 shadow-sm">
        <img
          src={testimonials[current].image}
          alt={testimonials[current].name}
          className="rounded-circle mb-3 shadow"
          style={{
            width: "90px",
            height: "90px",
            objectFit: "cover",
          }}
        />

        <p className="fst-italic text-secondary mb-3">
          “{testimonials[current].quote}”
        </p>

        <h5 className="fw-bold mb-0">{testimonials[current].name}</h5>
        <small className="text-muted">{testimonials[current].role}</small>
      </div>
    </motion.div>
  </Container>
</section>


{/* Trusted / Social Proof */}
<section className="py-5" style={{ background: "#f3f6fb" }}>
  <Container className="text-center">
    <p className="text-muted mb-4">
      Trusted by customers across Africa and beyond
    </p>

    <div className="row justify-content-center g-4">
      <div className="col-6 col-md-3">
        <div className="bg-white rounded-4 shadow-sm p-3">
          <h3 className="fw-bold text-primary mb-0">100K+</h3>
          <small className="text-muted">Active Users</small>
        </div>
      </div>

      <div className="col-6 col-md-3">
        <div className="bg-white rounded-4 shadow-sm p-3">
          <h3 className="fw-bold text-primary mb-0">15+</h3>
          <small className="text-muted">Countries Served</small>
        </div>
      </div>

      <div className="col-6 col-md-3">
        <div className="bg-white rounded-4 shadow-sm p-3">
          <h3 className="fw-bold text-primary mb-0">99.9%</h3>
          <small className="text-muted">Uptime</small>
        </div>
      </div>

      <div className="col-6 col-md-3">
        <div className="bg-white rounded-4 shadow-sm p-3">
          <h3 className="fw-bold text-primary mb-0">24/7</h3>
          <small className="text-muted">Support</small>
        </div>
      </div>
    </div>
  </Container>
</section>



      {/* CTA */}
      <section
        className="py-5 text-center text-white"
        style={{
          background: "linear-gradient(90deg, #0a4cff, #0a2a8a)",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Container>
            <h2 className="fw-bold mb-3">Join First City Bank Today</h2>
            <p className="mb-4">
              Open your account in minutes and enjoy a new level of digital banking.
            </p>
            <Button
              as={Link}
              to="/register"
              variant="light"
              size="lg"
              className="fw-semibold"
            >
              Create an Account
            </Button>
          </Container>
        </motion.div>
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
            box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          }
          .hero h1 {
            letter-spacing: 1px;
          }
        `}
      </style>
    </div>
  );
}
