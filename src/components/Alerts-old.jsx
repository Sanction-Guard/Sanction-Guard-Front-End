import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Alert, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

function Alerts() {
  const location = useLocation();
  const [flaggedResults, setFlaggedResults] = useState(() => {
    // Load flagged results from local storage on initial render
    const savedFlaggedResults = localStorage.getItem('flaggedResults');
    return savedFlaggedResults ? JSON.parse(savedFlaggedResults) : [];
  });

  // Clear a flagged result (not a risk)
  const clearFlaggedResult = (index) => {
    const updatedResults = flaggedResults.filter((_, i) => i !== index);
    setFlaggedResults(updatedResults);
    localStorage.setItem('flaggedResults', JSON.stringify(updatedResults));
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
                        onClick={() => clearFlaggedResult(index)}
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
    </Container>
  );
}

export default Alerts;