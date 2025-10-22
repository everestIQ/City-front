import { Container, Row, Col, Card } from "react-bootstrap";

const Services = () => {
  const services = [
    { title: "Personal Banking", desc: "Savings, current, and fixed deposit accounts." },
    { title: "Loans", desc: "Quick approval for personal and business loans." },
    { title: "Online Banking", desc: "Access your accounts anytime, anywhere." },
    { title: "Corporate Solutions", desc: "Tailored services for businesses and enterprises." },
  ];

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Our Services</h2>
      <Row>
        {services.map((service, idx) => (
          <Col md={6} lg={3} key={idx} className="mb-4">
            <Card className="h-100 shadow">
              <Card.Body>
                <Card.Title>{service.title}</Card.Title>
                <Card.Text>{service.desc}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Services;
