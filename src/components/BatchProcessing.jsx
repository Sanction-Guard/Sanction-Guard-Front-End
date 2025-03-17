import React from 'react';
import { Container, Card, Button, Badge } from 'react-bootstrap';
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Button.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';
import '../styles/layouts/BatchProcessing.css';

function BatchProcessing() {
  return (
    <Container>
      <div className="mb-4 fade-in">
        <h2 className="text-2xl font-bold mb-2">Batch Processing</h2>
        <p className="text-gray-600">Upload CSV files to screen multiple entities at once.</p>
      </div>
      
      <Card className="mb-4 upload-card slide-up">
        <Card.Body>
          <div className="text-center p-4 border-2 border-dashed rounded-3 upload-area">
            <div 
              className="w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-3"
              style={{ backgroundColor: 'var(--primary-light)', opacity: '0.2' }}
            >
              <i className="bi bi-file-earmark-arrow-up fs-2" style={{ color: 'var(--primary)' }}></i>
            </div>
            <p className="text-gray-600 mb-3">Upload CSV file with entities to screen</p>
            <Button variant="primary" className="btn-ripple">Upload File</Button>
          </div>
        </Card.Body>
      </Card>

      <div className="mt-6 slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-xl font-semibold mb-3">Recent Batch Jobs</h3>
        
        <Card className="mb-3 dashboard-card">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1 font-medium">customers_march.csv</h5>
                <p className="text-muted mb-0">1,234 records</p>
              </div>
              <Badge bg="primary">Processing</Badge>
            </div>
            
            <div className="mt-3 pt-3 border-t w-full">
              <div className="w-full bg-medium-gray rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">45% complete</p>
            </div>
          </Card.Body>
        </Card>

        <Card className="dashboard-card" style={{ animationDelay: '0.2s' }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1 font-medium">vendors_q1.csv</h5>
                <p className="text-muted mb-0">891 records</p>
              </div>
              <Badge bg="success">Completed</Badge>
            </div>
            
            <div className="mt-3 pt-3 border-t w-full">
              <div className="w-full bg-medium-gray rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <p className="text-xs text-gray-500">Completed on: May 15, 2023</p>
                <p className="text-xs text-gray-500">Time: 3m 45s</p>
              </div>
            </div>
          </Card.Body>
        </Card>
        
        <div className="text-center mt-4">
          <Button variant="primary" className="btn-ripple">View All Batch Jobs</Button>
        </div>
      </div>
    </Container>
  );
}

export default BatchProcessing;