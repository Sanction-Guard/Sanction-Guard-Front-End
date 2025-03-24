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
      <div className="mb-4 fade-in">
        <h2 className="text-2xl font-bold mb-2">Batch Screening</h2>
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
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload" className={`btn ${file ? 'btn-secondary' : 'btn-primary'} btn-ripple`}>
              {file ? file.name : 'Upload File'}
            </label>
            {file && (
              <Button
                variant="primary"
                className="ms-2 btn-ripple"
                onClick={handleProcessBatch}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner me-2"></span>
                    Processing...
                  </>
                ) : (
                  'Process Batch'
                )}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="danger" className="slide-up">
          <div className="flex items-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        </Alert>
      )}

      <div className="mt-6 slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-xl font-semibold mb-3">Recent Batch Jobs</h3>
        
        {batchResults.length > 0 ? (
          batchResults.map((result, index) => (
            <Card key={index} className="mb-3 dashboard-card" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
              <Card.Body style={{ padding: '1rem' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1 font-medium">{result.name}</h5>
                    <p className="text-gray-500 mb-0">{result.matches.length} matches found</p>
                  </div>
                  <Badge bg="primary" className="badge-styled">Processed</Badge>
                </div>

                {/* Display top 5 matches */}
                <Accordion className="mt-3 results-accordion">
                  <Accordion.Item eventKey={index.toString()}>
                    <Accordion.Header>View Top 5 Matches</Accordion.Header>
                    <Accordion.Body>
                      {result.matches.map((match, matchIndex) => (
                        <div key={matchIndex} className="match-result-item">
                          <div className="d-flex justify-content-between align-items-center p-2 match-header">
                            <div>
                              <p className="mb-0 font-medium">
                                <strong>Match {matchIndex + 1}:</strong> {match.data.firstName} {match.data.secondName} {match.data.thirdName}
                              </p>
                              <p className="mb-0 text-gray-500">
                                <strong>Score:</strong> {match.score.toFixed(2)}
                              </p>
                            </div>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="details-toggle-btn"
                              onClick={() => toggleMatchDetails(result.name, matchIndex)}
                            >
                              {expandedMatch === `${result.name}-${matchIndex}` ? 'Hide Details' : 'More Info'}
                            </Button>
                          </div>

                          {/* Display additional details if expanded */}
                          {expandedMatch === `${result.name}-${matchIndex}` && (
                            <div className="match-details-container">
                              <Table striped bordered size="sm" className="mt-2 match-details-table">
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
                            </div>
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
          <Card className="dashboard-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1 font-medium">No batch jobs processed yet</h5>
                  <p className="text-gray-500 mb-0">Upload and process a CSV file to see results</p>
                </div>
                <Badge bg="secondary" className="badge-styled">Awaiting Data</Badge>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </Container>
  );
}

export default BatchProcessing;