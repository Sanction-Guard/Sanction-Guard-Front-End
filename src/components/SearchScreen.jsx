import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner, Dropdown } from 'react-bootstrap';
import { useSearch } from './SearchContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function SearchScreen() {
  const { totalSearches, setTotalSearches, totalMatches, setTotalMatches, searchResults, setSearchResults } = useSearch();
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedResults, setExpandedResults] = useState({});
  const [searchType, setSearchType] = useState('individual');
  const [totalRecords, setTotalRecords] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [flaggedResults, setFlaggedResults] = useState(() => {
    // Load flagged results from local storage on initial render
    const savedFlaggedResults = localStorage.getItem('flaggedResults');
    return savedFlaggedResults ? JSON.parse(savedFlaggedResults) : [];
  });
  const SIMILARITY_THRESHOLD = 70; // 70% threshold for display
  const navigate = useNavigate(); // Hook for navigation

  // Save flagged results to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('flaggedResults', JSON.stringify(flaggedResults));
  }, [flaggedResults]);

  // Function to export results to text file
  const exportResultsToTextFile = (results) => {
    const text = results.map(result => {
      return `Name: ${result.firstName} ${result.secondName} ${result.thirdName}
Similarity: ${result.similarityPercentage}%
Type: ${result.type || 'N/A'}
Source: ${result.source || 'N/A'}
Country: ${result.country || 'N/A'}
--------------------------`;
    }).join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-results-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTotalSearches((prev) => prev + 1);

      const response = await fetch('http://localhost:3001/api/search/search?', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm, searchType }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const results = await response.json();
      
      // Filter the results by similarity threshold (as a backup in case server doesn't filter)
      const filteredResults = results.filter(result => 
        parseFloat(result.similarityPercentage) >= SIMILARITY_THRESHOLD
      );

      // Store flagged results (matches above 90%)
      const flagged = filteredResults.filter(result => 
        parseFloat(result.similarityPercentage) >= 90
      );

      // Append new flagged results to existing flagged results
      setFlaggedResults((prev) => {
        const newFlaggedResults = [...prev, ...flagged];
        // Remove duplicates based on a unique identifier (e.g., result.id or full name)
        const uniqueFlaggedResults = Array.from(new Set(newFlaggedResults.map(result => result.id || result.fullName)))
          .map(id => newFlaggedResults.find(result => result.id === id || result.fullName === id));
        return uniqueFlaggedResults;
      });

      setSearchResults(filteredResults);
      setExpandedResults({});
      setTotalMatches((prev) => prev + filteredResults.length);

      // Sending the stuff to database
      const logResponse = await fetch('http://localhost:3001/api/search/search?', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm,
          searchType,
          userId: 'user123',  
          action: 'Search',
          timestamp: new Date().toISOString(),
        }),
      });
  
      if (!logResponse.ok) {
        throw new Error('Failed to log search data');
      }
  
      // Only add analytics data if we have results above threshold
      if (filteredResults.length > 0) {
        setAnalyticsData(prev => [
          ...prev,
          {
            searchedName: searchTerm,
            matchedName: filteredResults[0].fullName,
            dateOfBirth: filteredResults[0].dateOfBirth || '-',
            nicNumber: filteredResults[0].nicNumber || '-',
            timestamp: new Date().toLocaleString(),
          }
        ]);
      }

    } catch (err) {
      console.error('Search error:', err);
      setError(`Error searching: ${err.message}`);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDatabaseStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/audit-logs?');
      if (!response.ok) {
        throw new Error('Failed to fetch database status');
      }

      const status = await response.json();
      setTotalRecords(status.totalRecords);
      setLastUpdated(status.lastUpdated);

    } catch (err) {
      console.error('Error fetching database status:', err);
      setTotalRecords(0);
      setLastUpdated('Error');
    }
  };

  useEffect(() => {
    fetchDatabaseStatus();
  }, []);

  const toggleExpand = (index) => {
    setExpandedResults((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Navigate to Alerts page with flagged results
  const navigateToAlerts = () => {
    navigate('/alerts', { state: { flaggedResults } });
  };

  return (
    <Container>
      <Card className="mb-4">
        <Card.Body>
          <h4 className="mb-3">Advanced Screening</h4>
          <Form onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Enter name, entity, or identifier..."
                className="flex-grow-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-filter">
                  Filter by {searchType === 'individual' ? 'Individual' : 'Entity'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSearchType('individual')}>Individual</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSearchType('entity')}>Entity</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button
                variant="dark"
                type="submit"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'Screen'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Add a button to navigate to Alerts page */}
      <Button variant="warning" onClick={navigateToAlerts} className="mb-4">
        View Flagged Results ({flaggedResults.length})
      </Button>

      {searchResults && (
        <Card className="mb-4">
          <Card.Body>
            <h5>Search Results (Minimum {SIMILARITY_THRESHOLD}% Similarity)</h5>
            {searchResults.length === 0 ? (
              <Alert variant="info">No matches found with at least {SIMILARITY_THRESHOLD}% similarity</Alert>
            ) : (
              <div>
                <p>Found {searchResults.length} potential matches</p>
                {searchResults.map((result, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                      <Col xs={5}>
                        <h6 className="mb-0">
                          {result.firstName} {result.secondName} {result.thirdName}
                        </h6>
                      </Col>

                      <Col xs={4} className="text-center">
                        <strong>Similarity: {result.similarityPercentage}%</strong>
                      </Col>

                      <Col className="d-flex justify-content-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => toggleExpand(index)}
                        >
                          {expandedResults[index] ? 'Hide Details' : 'More Info'}
                        </Button>
                      </Col>
                    </Card.Header>
                    {expandedResults[index] && (
                      <Card.Body>
                        <table className="table table-bordered table-sm">
                          <tbody>
                            {result.firstName && (
                              <tr>
                                <th>First Name</th>
                                <td>{result.firstName}</td>
                              </tr>
                            )}
                            {result.secondName && (
                              <tr>
                                <th>Second Name</th>
                                <td>{result.secondName}</td>
                              </tr>
                            )}
                            {result.thirdName && (
                              <tr>
                                <th>Third Name</th>
                                <td>{result.thirdName}</td>
                              </tr>
                            )}
                            {result.full_name && (
                              <tr>
                                <th>Full Name</th>
                                <td>{result.full_name}</td>
                              </tr>
                            )}
                            {result.aliasNames && result.aliasNames.length > 0 && (
                              <tr>
                                <th>Alias Names</th>
                                <td>{result.aliasNames.join(', ')}</td>
                              </tr>
                            )}
                            {result.source && (
                              <tr>
                                <th>Source</th>
                                <td>{result.source}</td>
                              </tr>
                            )}
                            {result.type && (
                              <tr>
                                <th>Type</th>
                                <td>{result.type}</td>
                              </tr>
                            )}
                            {result.country && (
                              <tr>
                                <th>Country</th>
                                <td>{result.country}</td>
                              </tr>
                            )}
                            {result.similarityPercentage && (
                              <tr>
                                <th>Similarity %</th>
                                <td>{result.similarityPercentage}%</td>
                              </tr>
                            )}
                            {result.score && (
                              <tr>
                                <th>Score</th>
                                <td>{result.score}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </Card.Body>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      <Row>
        <Col md={4} className="equal-height-col">
          <Card>
            <Card.Body>
              <h5 className="m-3">Today's Activity</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>Searches</span>
                <span>{totalSearches}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Matches</span>
                <span>{totalMatches}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="equal-height-col">
          <Card>
            <Card.Body>
              <h5 className="m-3">Database Status</h5>
              <div className="d-flex justify-content-between mb-3">
                <span>Total Records</span>
                <span>{totalRecords}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Last Updated</span>
                <span>{lastUpdated || 'N/A'}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="equal-height-col">
          <Card>
            <Card.Body>
              <h5 className="m-2">Quick Actions</h5>
              <div className="d-grid gap-1">
                <Button variant="outline-primary" onClick={() => {
                  fetchDatabaseStatus();
                  setTotalSearches(0);
                  setTotalMatches(0);
                  setSearchResults(null);
                }}>
                  <i className="bi bi-arrow-clockwise"></i> Refresh Data
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => {
                    if (searchResults && searchResults.length > 0) {
                      exportResultsToTextFile(searchResults);
                    } else {
                      alert('No results to export');
                    }
                  }}
                >
                  <i className="bi bi-download"></i> Export Results
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SearchScreen;