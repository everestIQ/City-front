import { Container, Row, Col, Card } from "react-bootstrap";

const About = () => {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Body>
              <h2>About Us</h2>
              <p>
                FirstCity Bank has been serving communities with trust and 
                innovation for over 25 years. Our mission is to provide 
                secure, transparent, and accessible financial services 
                for individuals and businesses alike.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
