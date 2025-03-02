import React from 'react';
import { Container, Card, Form, Button, Badge } from 'react-bootstrap';

function AuditLog() {
  return (
    <Container>
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">System Audit Log</h4>
            <div>
              <Form.Control
                type="text"
                placeholder="Search audit logs..."
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
            {/* TODO: Implement dynamic audit log entries from backend */}
            <div className="d-flex justify-content-between align-items-start mb-3 p-3 bg-light rounded">
              <div>
                <h5 className="mb-1">Demo update</h5>
                <p className="mb-1">Demo list updated with no new entries</p>
                <small className="text-muted">User: demo | IP: 127.0.0.1</small>
              </div>
              <Badge bg="dark">N/A mins ago</Badge>
            </div>

            {/* <div className="d-flex justify-content-between align-items-start mb-3 p-3 bg-light rounded">
              <div>
                <h5 className="mb-1">N/A</h5>
                <p className="mb-1">N/A</p>
                <small className="text-muted">User: N/A | IP: N/A</small>
              </div>
              <Badge bg="dark">N/A</Badge>
            </div>

            <div className="d-flex justify-content-between align-items-start mb-3 p-3 bg-light rounded">
              <div>
                <h5 className="mb-1">N/A</h5>
                <p className="mb-1">N/A</p>
                <small className="text-muted">User: N/A | IP: N/A</small>
              </div>
              <Badge bg="dark">N/A</Badge>
            </div> */}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            {/* TODO: Implement dynamic pagination info from backend */}
            <small className="text-muted">Showing 1 of 1 entries</small>
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