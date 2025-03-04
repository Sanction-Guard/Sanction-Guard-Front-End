import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { useSearch } from './SearchContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


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
  const { totalSearches, totalMatches, searchResults } = useSearch();

  const matchRate = totalSearches > 0 ? ((totalMatches / totalSearches) * 100).toFixed(2) : 0;
  const responseTime = (Math.random() * 2 + 1).toFixed(2); // Simulating response time (1-3 sec)

  const generatePDF = () => {
    if (!searchResults || searchResults.length === 0) {
      alert("No data to generate the report.");
      return;
    }

    const doc = new jsPDF();
    const date = new Date().toLocaleString();

    doc.setFontSize(18);
    doc.text('Daily Screening Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${date}`, 14, 30);
    doc.text(`Total Searches: ${totalSearches}`, 14, 40);
    doc.text(`Total Matches: ${totalMatches}`, 14, 50);
    doc.text(`Match Rate: ${matchRate}%`, 14, 60);
    doc.text(`Avg Response Time: ${responseTime} sec`, 14, 70);

    if (searchResults && searchResults.length > 0) {
      const tableColumn = ['Reference No.', 'Full Name', 'Date of Birth', 'NIC No.', 'Similarity %'];
      const tableRows = searchResults.map(result => [
        result.referenceNumber || '-',
        result.fullName || '-',
        result.dateOfBirth || '-',
        result.nicNumber || '-',
        result.similarityPercentage ? result.similarityPercentage + '%' : '-'
      ]);

      doc.autoPrint({
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'grid', // Add grid theme for better readability
        headStyles: { fillColor: [41, 128, 185], textColor: 255 }, // Customize header style
      });
    } else {
      doc.text('No matches found for today.', 14, 80);
    }

    doc.save(`screening_report_${date.replace(/[\s:/]/g, '_')}.pdf`);
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Screening Summary</h5>
              <p className="text-muted">Daily screening activities and matches</p>
              <Button variant="primary" className="w-100" onClick={generatePDF}>
                Generate PDF
              </Button>
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
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="mb-1">Latest Screening Report</h5>
              <small className="text-muted">{new Date().toLocaleDateString()}</small>
            </div>
            <div>
              <Button variant="outline-secondary" className="me-2">Preview</Button>
              <Button variant="dark">Download</Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      <h3 className="mb-3">Analytics Dashboard</h3>
      <Row>
        <Col md={4}>
          <Card className="analytics-card">
            <div className="stat-label">Total Screenings</div>
            <div className="stat-value">{totalSearches}</div>
            <div className={`trend-indicator ${totalSearches > 10 ? 'trend-up' : 'trend-down'}`}>
              {totalSearches > 10 ? '↑ Increase' : '↓ Decrease'}
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="analytics-card">
            <div className="stat-label">Match Rate</div>
            <div className="stat-value">{matchRate}%</div>
            <div className={`trend-indicator ${matchRate > 50 ? 'trend-up' : 'trend-down'}`}>
              {matchRate > 50 ? '↑ High' : '↓ Low'}
            </div>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="analytics-card">
            <div className="stat-label">Avg Response Time</div>
            <div className="stat-value">{responseTime} sec</div>
            <div className="trend-indicator trend-up">Stable</div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ReportsAnalytics;