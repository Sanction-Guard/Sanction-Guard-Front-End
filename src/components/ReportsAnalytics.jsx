import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ReportsAnalytics() {
  return (
    <Container>
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Screening Summary</h5>
              <p className="text-muted">Daily screening activities and matches</p>
              <Button variant="primary" className="w-100">Generate</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Risk Analysis</h5>
              <p className="text-muted">Risk levels and screening patterns</p>
              <Button variant="primary" className="w-100">Generate</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Compliance Report</h5>
              <p className="text-muted">System usage and compliance tracking</p>
              <Button variant="primary" className="w-100">Generate</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <h4>Generated Reports</h4>
          {/* TODO: Implement dynamic generated reports from backend */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-1">March 2020 Demo Report</h5>
              <small className="text-muted">Generated on N/A</small>
            </div>
            <div>
              <Button variant="outline-secondary" className="me-2">Preview</Button>
              <Button variant="dark">Download</Button>
            </div>
          </div>
          {/* <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">N/A</h5>
              <small className="text-muted">Generated on N/A</small>
            </div>
            <div>
              <Button variant="outline-secondary" className="me-2">Preview</Button>
              <Button variant="dark">Download</Button>
            </div>
          </div> */}
        </Card.Body>
      </Card>

      <h3 className="mb-3">Analytics Dashboard</h3>
      <Row>
        {/* TODO: Implement dynamic analytics metrics from backend */}
        <Col md={4}>
          <Card className="analytics-card">
            <div className="stat-label">Total Screenings</div>
            <div className="stat-value">N/A</div>
            <div className="trend-indicator trend-up">N/A</div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="analytics-card">
            <div className="stat-label">Match Rate</div>
            <div className="stat-value">N/A</div>
            <div className="trend-indicator trend-down">N/A</div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="analytics-card">
            <div className="stat-label">Average Response Time</div>
            <div className="stat-value">N/A</div>
            <div className="trend-indicator trend-up">N/A</div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ReportsAnalytics;