import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Table, Modal, Form, Badge } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import '../styles/components/Animation.css';
import '../styles/components/StatusBadge.css';

/**
 * Alerts Component
 * 
 * This component displays flagged search results with high similarity scores (>90%).
 * It provides functionality to clear flagged results with reason tracking.
 * 
 * @returns {JSX.Element} The alerts UI
 */
function Alerts() {
  const location = useLocation();
  const [flaggedResults, setFlaggedResults] = useState(() => {
    // Load flagged results from local storage on initial render
    const savedFlaggedResults = localStorage.getItem('flaggedResults');
    return savedFlaggedResults ? JSON.parse(savedFlaggedResults) : [];
  });
  const [showClearModal, setShowClearModal] = useState(false); // State to control modal visibility
  const [selectedResultIndex, setSelectedResultIndex] = useState(null); // Index of the result to clear
  const [clearReason, setClearReason] = useState(''); // Reason for clearing the flagged result
  const [clearHistory, setClearHistory] = useState(() => {
    // Load clear history from local storage
    const savedClearHistory = localStorage.getItem('clearHistory');
    return savedClearHistory ? JSON.parse(savedClearHistory) : [];
  });

  // Handle opening the clear modal
  const handleClearClick = (index) => {
    setSelectedResultIndex(index);
    setShowClearModal(true);
  };

  // Handle closing the clear modal
  const handleCloseClearModal = () => {
    setShowClearModal(false);
    setClearReason(''); // Reset the reason input
  };

  // Handle submitting the clear reason
  const handleClearSubmit = () => {
    if (!clearReason.trim()) {
      alert('Please provide a reason for clearing this result.');
      return;
    }

    // Get the result being cleared
    const clearedResult = flaggedResults[selectedResultIndex];

    // Add to clear history
    const historyEntry = {
      result: clearedResult,
      reason: clearReason,
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [...clearHistory, historyEntry];
    setClearHistory(updatedHistory);
    localStorage.setItem('clearHistory', JSON.stringify(updatedHistory));

    // Log the reason (you can send this to your backend if needed)
    console.log(`Cleared result: ${clearedResult.firstName} ${clearedResult.secondName}, Reason: ${clearReason}`);

    // Remove the flagged result from the list
    const updatedResults = flaggedResults.filter((_, i) => i !== selectedResultIndex);
    setFlaggedResults(updatedResults);
    localStorage.setItem('flaggedResults', JSON.stringify(updatedResults));

    // Close the modal and reset the reason input
    handleCloseClearModal();
  };

  /**
   * Simple version of clearing a flagged result without tracking reason
   * Used as a fallback if modal interactions fail
   * 
   * @param {number} index - Index of the result to clear
   */
  const clearFlaggedResult = (index) => {
    // Ask for confirmation
    if (window.confirm("Are you sure you want to clear this flagged result?")) {
      const updatedResults = flaggedResults.filter((_, i) => i !== index);
      setFlaggedResults(updatedResults);
      localStorage.setItem('flaggedResults', JSON.stringify(updatedResults));
    }
  };

  /**
   * Get bootstrap color class based on similarity percentage
   * 
   * @param {number} similarity - Similarity percentage
   * @returns {string} Bootstrap color class
   */
  const getSimilarityColorClass = (similarity) => {
    if (similarity > 95) return "danger";
    if (similarity > 90) return "warning";
    return "info";
  };

  /**
   * Format a date string for better display
   * 
   * @param {string} dateStr - Date string to format
   * @returns {string} Formatted date
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <Container className="fade-in">
      <div className="d-flex justify-content-between align-items-center my-4">
        <h2>Flagged Results (Above 90% Similarity)</h2>
        <Button 
          variant="outline-secondary"
          size="sm"
          onClick={() => window.history.back()}
        >
          <i className="bi bi-arrow-left me-2"></i>Back to Search
        </Button>
      </div>

      {flaggedResults.length === 0 ? (
        <Alert variant="info">
          <div className="text-center py-4">
            <i className="bi bi-shield-check fs-1 text-muted mb-3 d-block"></i>
            <h5>No flagged results found</h5>
            <p className="text-muted">When search results have a similarity score above 90%, they will appear here</p>
          </div>
        </Alert>
      ) : (
        <Card className="dashboard-card">
          <Card.Body>
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="bg-light">
                  <tr>
                    <th>Name</th>
                    <th style={{ width: '120px' }}>Similarity</th>
                    <th>Source</th>
                    <th>Type</th>
                    <th>Country</th>
                    <th style={{ width: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flaggedResults.map((result, index) => {
                    const similarityValue = parseFloat(result.similarityPercentage) || 0;
                    const colorClass = getSimilarityColorClass(similarityValue);
                    
                    return (
                      <tr key={index}>
                        <td>
                          <strong>{result.firstName} {result.secondName} {result.thirdName}</strong>
                          {result.dateOfBirth && (
                            <div className="small text-muted mt-1">DOB: {result.dateOfBirth}</div>
                          )}
                        </td>
                        <td>
                          <Badge bg={colorClass} className="w-100 py-2">
                            {result.similarityPercentage}%
                          </Badge>
                        </td>
                        <td>{result.source || 'N/A'}</td>
                        <td>{result.type || 'N/A'}</td>
                        <td>{result.country || 'N/A'}</td>
                        <td>
                          <Button
                            variant="success"
                            size="sm"
                            className="w-100"
                            onClick={() => handleClearClick(index)}
                          >
                            <i className="bi bi-check me-1"></i>Clear
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Clear history section */}
      {clearHistory.length > 0 && (
        <div className="mt-5">
          <h4>Clear History</h4>
          <Card className="dashboard-card mt-3">
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover size="sm">
                  <thead className="bg-light">
                    <tr>
                      <th>Cleared Name</th>
                      <th>Similarity</th>
                      <th>Reason</th>
                      <th>Date Cleared</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clearHistory.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.result.firstName} {entry.result.secondName}</td>
                        <td>{entry.result.similarityPercentage}%</td>
                        <td>{entry.reason}</td>
                        <td>{formatDate(entry.timestamp)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Clear Reason Modal */}
      <Modal show={showClearModal} onHide={handleCloseClearModal}>
        <Modal.Header closeButton>
          <Modal.Title>Clear Flagged Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="clearReason">
              <Form.Label>Reason for Clearing</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter the reason for clearing this result..."
                value={clearReason}
                onChange={(e) => setClearReason(e.target.value)}
              />
              <Form.Text className="text-muted">
                This information will be recorded for audit purposes.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseClearModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleClearSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Alerts;