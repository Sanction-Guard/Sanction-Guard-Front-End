import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Button.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';
import '../styles/layouts/DataImport.css';

function DataImport() {
  return (
    <div className="data-import-container fade-in">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Sanctions List Import</h1>
        <p className="text-gray-600">Import and manage sanctions list data from various sources.</p>
      </div>
      
      {/* Upload Card */}
      <Card className="mb-4 upload-card slide-up">
        <Card.Body>
          <div className="text-center p-4 border-2 border-dashed rounded upload-area">
            {/* Icon container with styling */}
            <div 
              className="w-16 h-16 mx-auto flex items-center justify-center rounded-full mb-3"
              style={{ backgroundColor: 'var(--primary-light)', opacity: '0.2' }}
            >
              <i className="bi bi-upload fs-2" style={{ color: 'var(--primary)' }}></i>
            </div>
            
            <h3 className="font-semibold mb-2">Upload sanctions list files</h3>
            <p className="text-gray-600 mb-3">Support for PDF, XML, CSV formats</p>
            
            <div>
              <Button className="btn btn-primary btn-ripple me-2">Select Files</Button>
              <Button className="btn btn-secondary">Import History</Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Recent Imports Section */}
      <div className="mt-6 slide-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-xl font-semibold mb-3">Recent Imports</h2>
        
        <Row className="dashboard-grid">
          {/* TODO: Implement dynamic recent imports from backend */}
          <Col md={6} className="mb-4">
            <Card className="dashboard-card h-100" style={{ animationDelay: '0.2s' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="font-medium mb-2">UN Sanctions List</h5>
                    <p className="text-gray-600">N/A entries updated</p>
                    <small className="text-gray-500">N/A mins ago</small>
                  </div>
                  
                  {/* Icon container */}
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: 'var(--primary-light)', opacity: '0.2' }}
                  >
                    <i className="bi bi-file-earmark-text" style={{ color: 'var(--primary)' }}></i>
                  </div>
                </div>
                
                {/* Status indicator */}
                <div className="mt-3 pt-3 border-t">
                  <span className="status-badge info">Pending</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={6} className="mb-4">
            <Card className="dashboard-card h-100" style={{ animationDelay: '0.3s' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="font-medium mb-2">EU Consolidated List</h5>
                    <p className="text-gray-600">N/A entries updated</p>
                    <small className="text-gray-500">N/A hours ago</small>
                  </div>
                  
                  {/* Icon container */}
                  <div 
                    className="p-3 rounded-full"
                    style={{ backgroundColor: 'var(--primary-light)', opacity: '0.2' }}
                  >
                    <i className="bi bi-file-earmark-text" style={{ color: 'var(--primary)' }}></i>
                  </div>
                </div>
                
                {/* Status indicator */}
                <div className="mt-3 pt-3 border-t">
                  <span className="status-badge info">Pending</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Action button */}
        <div className="text-center mt-4">
          <Button className="btn btn-primary btn-ripple">View All Import History</Button>
        </div>
      </div>
    </div>
  );
}

export default DataImport;