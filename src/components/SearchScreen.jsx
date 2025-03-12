import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner, Dropdown } from 'react-bootstrap';
import { useSearch } from './SearchContext';
import ReportsAnalytics from "./ReportsAnalytics";

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

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTotalSearches((prev) => prev + 1);

      const response = await fetch('http://localhost:3001/api/search/search', {
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
      setSearchResults(results);
      setExpandedResults({});
      setTotalMatches((prev) => prev + results.length);

      setAnalyticsData(prev => [
        ...prev,
        {
          searchedName: searchTerm,
          matchedName: results.length > 0 ? results[0].fullName : 'No Match',
          dateOfBirth: results.length > 0 ? results[0].dateOfBirth : '-',
          nicNumber: results.length > 0 ? results[0].nicNumber : '-',
          timestamp: new Date().toLocaleString(),
        }
      ]);

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
      const response = await fetch('http://localhost:3001/api/search/status');
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

      {searchResults && (
        <Card className="mb-4">
          <Card.Body>
            <h5>Search Results</h5>
            {searchResults.length === 0 ? (
              <Alert variant="info">No matches found</Alert>
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
                      exportResultsToTextFile(searchResults);  // Call the export function
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