import { Container, Row, Col, Card } from "react-bootstrap";
import { FaShieldAlt, FaUsers, FaGlobe, FaHandshake } from "react-icons/fa";

const About = () => {
  return (
    <div style={{ background: "#f7f9fc" }}>
      
      {/* Hero Section */}
      <section
        className="text-white text-center d-flex align-items-center"
        style={{
          background: "linear-gradient(90deg, #0b64e1, #073a9b)",
          minHeight: "35vh",
        }}
      >
        <Container>
          <h1 className="display-5 fw-bold">About First City Bank</h1>
          <p className="lead mt-2 opacity-75">
            Trusted Banking • Modern Innovation • Community at Heart
          </p>
        </Container>
      </section>

      {/* Story Section */}
      <Container className="py-5">
        <Row className="justify-content-center mb-4">
          <Col md={10}>
            <Card className="border-0 shadow-sm p-4 rounded-4">
              <h3 className="fw-bold mb-3">Our Story</h3>
              <p className="fs-5 text-muted">
                For over <strong>25 years</strong>, First City Bank has grown from a small
                community institution into a trusted financial partner for thousands
                of individuals and businesses worldwide. Our foundation is built on
                integrity, innovation, and an unwavering commitment to customer trust.
              </p>
              <p className="fs-5 text-muted">
                Today, we blend cutting-edge digital banking with personalized
                support to give our customers the freedom to bank safely, quickly,
                and confidently — from anywhere in the world.
              </p>
            </Card>
          </Col>
        </Row>

        {/* Mission & Vision */}
        <Row className="justify-content-center mb-5">
          <Col md={5} className="mb-4">
            <Card className="h-100 border-0 shadow-sm p-4 rounded-4">
              <h4 className="fw-bold text-primary">Our Mission</h4>
              <p className="mt-3 text-muted fs-6">
                To empower individuals and businesses with reliable, secure, and
                innovative banking solutions that simplify life and enable growth.
              </p>
            </Card>
          </Col>

          <Col md={5} className="mb-4">
            <Card className="h-100 border-0 shadow-sm p-4 rounded-4">
              <h4 className="fw-bold text-primary">Our Vision</h4>
              <p className="mt-3 text-muted fs-6">
                To be the most trusted digital-first bank in Africa, known for
                transparency, speed, and exceptional customer experience.
              </p>
            </Card>
          </Col>
        </Row>

        {/* Features Section */}
        <h3 className="text-center fw-bold mb-4">What Makes Us Different</h3>
        <Row className="text-center">
          {[
            {
              icon: <FaShieldAlt size={42} />,
              title: "Secure Banking",
              text: "Top-tier encryption, fraud detection and 24/7 monitoring."
            },
            {
              icon: <FaUsers size={42} />,
              title: "Customer First",
              text: "Personalized support from real people who care."
            },
            {
              icon: <FaGlobe size={42} />,
              title: "Global Access",
              text: "Bank anytime, anywhere — from any device."
            },
            {
              icon: <FaHandshake size={42} />,
              title: "Trusted Partner",
              text: "Decades of reliability, transparency, and community impact."
            }
          ].map((feature, i) => (
            <Col md={3} className="mb-4" key={i}>
              <Card
                className="h-100 border-0 shadow-sm py-4 rounded-4 about-card"
              >
                <div className="text-primary mb-3">{feature.icon}</div>
                <h5 className="fw-bold">{feature.title}</h5>
                <p className="text-muted px-2">{feature.text}</p>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Timeline Strip */}
        <div className="text-center mt-5">
          <h4 className="fw-bold mb-4">Our Journey</h4>
          <div className="timeline-strip">
            <div className="timeline-item"><strong>1999</strong> — Founded</div>
            <div className="timeline-item"><strong>2008</strong> — First 50k Users</div>
            <div className="timeline-item"><strong>2017</strong> — Digital Banking Launch</div>
            <div className="timeline-item"><strong>2024</strong> — 1M+ Customers Served</div>
          </div>
        </div>

      </Container>
    </div>
  );
};

export default About;

