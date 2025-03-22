import React, { useState } from 'react';
import { Container, Card, Button, Alert, Table, Modal, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

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

    // Log the reason (you can send this to your backend if needed)
    console.log(`Cleared result: ${flaggedResults[selectedResultIndex].fullName}, Reason: ${clearReason}`);

    // Remove the flagged result from the list
    const updatedResults = flaggedResults.filter((_, i) => i !== selectedResultIndex);
    setFlaggedResults(updatedResults);
    localStorage.setItem('flaggedResults', JSON.stringify(updatedResults));

    // Close the modal and reset the reason input
    handleCloseClearModal();
  };

  return (
    <Container>
      <h2 className="my-4">Flagged Results (Above 90% Similarity)</h2>

      {flaggedResults.length === 0 ? (
        <Alert variant="info">No flagged results found.</Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Similarity %</th>
                  <th>Source</th>
                  <th>Type</th>
                  <th>Country</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {flaggedResults.map((result, index) => (
                  <tr key={index}>
                    <td>{result.firstName} {result.secondName} {result.thirdName}</td>
                    <td>{result.similarityPercentage}%</td>
                    <td>{result.source}</td>
                    <td>{result.type}</td>
                    <td>{result.country}</td>
                    <td>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleClearClick(index)}
                      >
                        Clear
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
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