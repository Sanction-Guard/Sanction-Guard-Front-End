import React, { useState } from 'react';
import { Container, Card, Button, Badge, Spinner, Alert, Accordion, Table } from 'react-bootstrap';
import Papa from 'papaparse'; // Ensure this import works after installation
import { processBatch } from './api'; // API utility for sending data to Elasticsearch
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Button.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';
import '../styles/layouts/BatchProcessing.css';

function BatchProcessing() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [batchResults, setBatchResults] = useState([]);
  const [expandedMatch, setExpandedMatch] = useState(null); // Track expanded match details

  // Handle file upload
  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  // Process the uploaded CSV file
  const handleProcessBatch = async () => {
    if (!file) {
      setError('Please upload a CSV file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Parse the CSV file
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: async (results) => {
          const data = results.data; // Array of objects from CSV
          console.log('Parsed CSV data:', data);

          // Send data to Elasticsearch for batch matching
          const response = await processBatch(data);
          console.log('Batch processing results:', response);

          // Update state with results
          setBatchResults(response);
        },
        error: (err) => {
          throw new Error('Failed to parse CSV file: ' + err.message);
        },
      });
    } catch (err) {
      console.error('Batch processing error:', err);
      setError(`Error processing batch: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle expanded match details
  const toggleMatchDetails = (name, matchIndex) => {
    setExpandedMatch(expandedMatch === `${name}-${matchIndex}` ? null : `${name}-${matchIndex}`);
  };

  return (
    <Container>
      <h2 className="mb-4">Batch Screening</h2>

      <Card className="mb-4">
        <Card.Body>
          <div className="text-center p-4 border-2 border-dashed rounded-3">
            <i className="bi bi-file-earmark-arrow-up fs-2 mb-3"></i>
            <p>Upload CSV file with entities to screen</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="btn btn-dark">
              {file ? file.name : 'Upload File'}
            </label>
            {file && (
              <Button
                variant="primary"
                className="ms-2"
                onClick={handleProcessBatch}
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Process Batch'}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      <h3 className="mb-3">Recent Batch Jobs</h3>
      {batchResults.length > 0 ? (
        batchResults.map((result, index) => (
          <Card key={index} className="mb-3">
            <Card.Body style={{ padding: '0.75rem' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1" style={{ fontSize: '1rem' }}>{result.name}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>{result.matches.length} matches found</p>
                </div>
                <Badge bg="primary">Processed</Badge>
              </div>

              {/* Display top 5 matches */}
              <Accordion className="mt-2">
                <Accordion.Item eventKey={index.toString()}>
                  <Accordion.Header style={{ fontSize: '0.875rem' }}>View Top 5 Matches</Accordion.Header>
                  <Accordion.Body>
                    {result.matches.map((match, matchIndex) => (
                      <div key={matchIndex} className="mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                              <strong>Match {matchIndex + 1}:</strong> {match.data.firstName} {match.data.secondName} {match.data.thirdName}
                            </p>
                            <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                              <strong>Score:</strong> {match.score.toFixed(2)}
                            </p>
                          </div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => toggleMatchDetails(result.name, matchIndex)}
                          >
                            {expandedMatch === `${result.name}-${matchIndex}` ? 'Hide Details' : 'More Info'}
                          </Button>
                        </div>

                        {/* Display additional details if expanded */}
                        {expandedMatch === `${result.name}-${matchIndex}` && (
                          <Table striped bordered size="sm" className="mt-2">
                            <tbody>
                              {match.data.firstName && (
                                <tr>
                                  <th>First Name</th>
                                  <td>{match.data.firstName}</td>
                                </tr>
                              )}
                              {match.data.secondName && (
                                <tr>
                                  <th>Second Name</th>
                                  <td>{match.data.secondName}</td>
                                </tr>
                              )}
                              {match.data.thirdName && (
                                <tr>
                                  <th>Third Name</th>
                                  <td>{match.data.thirdName}</td>
                                </tr>
                              )}
                              {match.data.full_name && (
                                <tr>
                                  <th>Full Name</th>
                                  <td>{match.data.full_name}</td>
                                </tr>
                              )}
                              {match.data.aliasNames && match.data.aliasNames.length > 0 && (
                                <tr>
                                  <th>Alias Names</th>
                                  <td>{match.data.aliasNames.join(', ')}</td>
                                </tr>
                              )}
                              {match.data.source && (
                                <tr>
                                  <th>Source</th>
                                  <td>{match.data.source}</td>
                                </tr>
                              )}
                              {match.data.type && (
                                <tr>
                                  <th>Type</th>
                                  <td>{match.data.type}</td>
                                </tr>
                              )}
                              {match.data.country && (
                                <tr>
                                  <th>Country</th>
                                  <td>{match.data.country}</td>
                                </tr>
                              )}
                              {match.data.similarityPercentage && (
                                <tr>
                                  <th>Similarity %</th>
                                  <td>{match.data.similarityPercentage}%</td>
                                </tr>
                              )}
                              {match.data.score && (
                                <tr>
                                  <th>Score</th>
                                  <td>{match.data.score}</td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        )}
                      </div>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        ))
      ) : (
        <Card>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">N/A</h5>
                <p className="text-muted mb-0">N/A records</p>
              </div>
              <Badge bg="secondary">N/A</Badge>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default BatchProcessing;