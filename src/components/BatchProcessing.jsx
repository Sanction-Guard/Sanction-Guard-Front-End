import React from 'react';
import { Container, Card, Button, Badge } from 'react-bootstrap';

function BatchProcessing() {
  return (
    <Container>
      <h2 className="mb-4">Batch Screening</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="text-center p-4 border-2 border-dashed rounded-3">
            <i className="bi bi-file-earmark-arrow-up fs-2 mb-3"></i>
            <p>Upload CSV file with entities to screen</p>
            <Button variant="dark">Upload File</Button>
          </div>
        </Card.Body>
      </Card>

      <h3 className="mb-3">Recent Batch Jobs</h3>
      {/* TODO: Implement dynamic batch jobs from backend */}
      <Card className="mb-3">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">demo_data.csv</h5>
              <p className="text-muted mb-0">N/A records</p>
            </div>
            <Badge bg="primary">Processed</Badge>
          </div>
        </Card.Body>
      </Card>

      {/* <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1">N/A</h5>
              <p className="text-muted mb-0">N/A records</p>
            </div>
            <Badge bg="success">N/A</Badge>
          </div>
        </Card.Body>
      </Card> */}
    </Container>
  );
}

export default BatchProcessing;