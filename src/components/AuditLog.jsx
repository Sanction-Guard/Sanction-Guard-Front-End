import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Badge, Spinner } from 'react-bootstrap';
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Form.css';
import '../styles/components/Button.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';
import '../styles/layouts/AuditLog.css';
import axios from 'axios';

function AuditLog() {
  const [logs, setLogs] = useState([]); // State to store audit logs
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  // Fetch audit logs on component mount
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/audit-logs');
        const sortedLogs = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by timestamp (newest first)
        setLogs(sortedLogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchLogs();
  }, []);
  

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <Container className="audit-log-container fade-in">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  // Show error message if request fails
  if (error) {
    return (
      <Container className="audit-log-container fade-in">
        <Alert variant="danger" className="slide-up border-left-danger">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-circle text-danger me-2" style={{ fontSize: '1.25rem' }}></i>
            <p className="mb-0">Error: {error}</p>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="audit-log-container fade-in">
      {/* Header section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">System Audit Log</h2>
        <p className="text-gray-600">Track all system activities and user actions.</p>
      </div>

      {/* Search and filter section */}
      <Card className="shadow-sm slide-up">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">Search Logs</h4>
            <div>
              <Form.Control
                type="text"
                placeholder="Search logs..."
                className="d-inline-block me-2"
                style={{ width: '300px' }}
              />
              <Button variant="outline-secondary" className="btn-secondary me-2 mb-2 mb-md-0">
                <i className="bi bi-funnel me-1"></i> Filter
              </Button>
              <Button variant="outline-secondary" className="btn-secondary mb-2 mb-md-0">
                <i className="bi bi-download me-1"></i> Export
              </Button>
            </div>
          </div>

          {/* Render audit log entries */}
          <div className="mb-4">
            {logs.map((log) => (
              <div key={log._id} className="d-flex justify-content-between align-items-start mb-3 p-3 bg-light rounded">
                <div>
                  <h5 className="mb-1">{log.searchTerm}</h5>
                  <p className="mb-1">Search Type: {log.searchType}</p>
                  <small className="text-muted">User: {log.userId} | Timestamp: {new Date(log.timestamp).toLocaleString()}</small>
                </div>
                <Badge bg="dark">{log.action === "search?" ? "Serach" : log.action}</Badge>
              </div>
            ))}
          </div>

          {/* Pagination section */}
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">Showing {logs.length} of {logs.length} entries</small>
            <div>
              <Button variant="outline-secondary" size="sm" className="me-2">Previous</Button>
              <Button variant="outline-secondary" size="sm">Next</Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AuditLog;