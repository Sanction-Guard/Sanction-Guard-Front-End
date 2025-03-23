import React from 'react';
import { Container, Card, Form, Button, Badge } from 'react-bootstrap';
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Form.css';
import '../styles/components/Button.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';
import '../styles/layouts/AuditLog.css';

function AuditLog() {
  return (
    <Container className="audit-log-container fade-in">
      {/* Header section */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">System Audit Log</h2>
        <p className="text-gray-600">Track all system activities and user actions.</p>
      </div>
      
      <Card className="shadow-sm slide-up">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <h4 className="mb-0 font-semibold">System Audit Log</h4>
            <div className="d-flex flex-wrap mt-2 mt-md-0">
              <Form.Control
                type="text"
                placeholder="Search audit logs..."
                className="search-bar me-2 mb-2 mb-md-0"
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

          <div className="mb-4 audit-logs-section">
            {/* TODO: Implement dynamic audit log entries from backend */}
            <div className="d-flex justify-content-between align-items-start mb-3 p-3 bg-light rounded audit-log-entry">
              <div className="audit-log-icon d-none d-md-flex">
                <div className="icon-circle database-update">
                  <i className="bi bi-database-check"></i>
                </div>
              </div>
              <div className="audit-log-content flex-grow-1 ms-md-3">
                <h5 className="mb-1 font-semibold">Demo update</h5>
                <p className="mb-1">Demo list updated with no new entries</p>
                <div className="audit-log-meta">
                  <span className="audit-meta-item">
                    <i className="bi bi-person me-1"></i> demo
                  </span>
                  <span className="audit-meta-item">
                    <i className="bi bi-globe me-1"></i> 127.0.0.1
                  </span>
                </div>
              </div>
              <Badge bg="info" className="status-badge info ms-2">N/A mins ago</Badge>
            </div>

            {/* Commented out entries - preserved original code */}
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

          <div className="d-flex justify-content-between align-items-center flex-wrap">
            {/* TODO: Implement dynamic pagination info from backend */}
            <small className="text-muted text-sm text-gray-500">Showing 1 of 1 entries</small>
            <div className="pagination-controls mt-2 mt-md-0">
              <Button variant="outline-secondary" size="sm" className="btn-secondary btn-sm me-2">
                <i className="bi bi-chevron-left me-1"></i> Previous
              </Button>
              <Button variant="outline-secondary" size="sm" className="btn-primary btn-sm">
                Next <i className="bi bi-chevron-right ms-1"></i>
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AuditLog;