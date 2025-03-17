import React, { useState, useEffect } from 'react';  // Import useState and useEffect hooks
import { Container, Card, Form, Button, Badge } from 'react-bootstrap';
import axios from 'axios';

function AuditLog() {

  const [logs, setLogs] = useState([]); // State to store search logs
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to track errors

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/audit-logs?'); 
        setLogs(response.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); 
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Show a loading message while fetching data
  }

  if (error) {
    return <p>Error: {error}</p>; // Show an error message if the request fails
  }

  return (
    <Container>
      <Card>
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
              <Button variant="outline-secondary" className="me-2">
                <i className="bi bi-funnel"></i> Filter
              </Button>
              <Button variant="outline-secondary">
                <i className="bi bi-download"></i> Export
              </Button>
            </div>
          </div>

          <div className="mb-4">
            {/* Render dynamic search log entries */}
            {logs.map((log) => (
              <div key={log._id} className="d-flex justify-content-between align-items-start mb-3 p-3 bg-light rounded">
                <div>
                  <h5 className="mb-1">{log.searchTerm}</h5>
                  <p className="mb-1">Search Type: {log.searchType}</p>
                  <small className="text-muted">User: {log.userId} | Timestamp: {new Date(log.timestamp).toLocaleString()}</small>
                </div>
                <Badge bg="dark">{log.action}</Badge>
              </div>
            ))}
          </div>

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
