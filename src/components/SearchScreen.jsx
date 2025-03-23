import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner, Dropdown } from 'react-bootstrap';
import { useSearch } from './SearchContext';
import { useNavigate } from 'react-router-dom';
import '../styles/layouts/SearchScreen.css';
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Button.css';
import '../styles/components/Form.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';

function SearchScreen() {
  const { 
    totalSearches, 
    setTotalSearches, 
    totalMatches, 
    setTotalMatches, 
    searchResults, 
    setSearchResults 
  } = useSearch();

  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedResults, setExpandedResults] = useState({});
  const [searchType, setSearchType] = useState('individual');
  const [totalRecords, setTotalRecords] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [flaggedResults, setFlaggedResults] = useState(() => {
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
  
      // Include userId in the request body
      const userId = 'user123'; // Replace with actual user ID (e.g., from authentication context)
  
      // Send search data to the backend
      const response = await fetch('http://localhost:3001/api/search/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm,
          searchType,
          userId, // Include userId in the request body
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
  
      const results = await response.json();
  
      // Filter the results by similarity threshold (as a backup in case server doesn't filter)
      const filteredResults = results.filter(
        (result) => parseFloat(result.similarityPercentage) >= SIMILARITY_THRESHOLD
      );
  
      // Store flagged results (matches above 90%)
      const flagged = filteredResults.filter(
        (result) => parseFloat(result.similarityPercentage) >= 90
      );
  
      // Append new flagged results to existing flagged results
      setFlaggedResults((prev) => {
        const newFlaggedResults = [...prev, ...flagged];
        // Remove duplicates based on a unique identifier (e.g., result.id or full name)
        const uniqueFlaggedResults = Array.from(
          new Set(newFlaggedResults.map((result) => result.id || result.fullName))
        ).map((id) =>
          newFlaggedResults.find((result) => result.id === id || result.fullName === id)
        );
        return uniqueFlaggedResults;
      });
  
      setSearchResults(filteredResults);
      setExpandedResults({});
      setTotalMatches((prev) => prev + filteredResults.length);
  
      // Log the search action to the database
      const logResponse = await fetch('http://localhost:3001/api/search/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm,
          searchType,
          userId,
          action: 'Search',
          timestamp: new Date().toISOString(),
        }),
      });
  
      if (!logResponse.ok) {
        throw new Error('Failed to log search data');
      }
  
      // Only add analytics data if we have results above threshold
      if (filteredResults.length > 0) {
        setAnalyticsData((prev) => [
          ...prev,
          {
            searchedName: searchTerm,
            matchedName: filteredResults[0].fullName,
            dateOfBirth: filteredResults[0].dateOfBirth || '-',
            nicNumber: filteredResults[0].nicNumber || '-',
            timestamp: new Date().toLocaleString(),
          },
        ])
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
      const response = await fetch('http://localhost:3001/api/audit-logs');
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
    <Container className="search-container fade-in" style={{ marginTop: '0' }}>
      {/* Page header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Advanced Screening</h1>
        <p className="text-gray-600">Search our database for individuals or entities.</p>
      </div>

      {/* Search card */}
      <Card className="mb-4 dashboard-card">
        <Card.Body className="p-4">
          <Form onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}>
            <div className="d-flex gap-2 search-form-wrapper">
              <div className="position-relative flex-grow-1">
                <i className="bi bi-search position-absolute" style={{ left: '15px', top: '12px', color: '#6c757d' }}></i>
                <Form.Control
                  type="text"
                  placeholder="Enter name, entity, or identifier..."
                  className="search-bar pl-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '40px' }}
                />
              </div>
              <Dropdown>
                <Dropdown.Toggle className="btn btn-secondary" id="dropdown-filter">
                  <i className="bi bi-funnel me-1"></i> {searchType === 'individual' ? 'Individual' : 'Entity'}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSearchType('individual')}>Individual</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSearchType('entity')}>Entity</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button
                variant="primary"
                type="submit"
                className="btn btn-primary btn-ripple"
                disabled={loading}
              >
                {loading ? (
                  <div className="d-flex align-items-center">
                    <span className="loading-spinner me-2"></span>
                    <span>Searching...</span>
                  </div>
                ) : (
                  <><i className="bi bi-search me-1"></i> Screen</>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Error message */}
      {error && (
        <Alert variant="danger" className="slide-up border-left-danger">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-circle text-danger me-2" style={{ fontSize: '1.25rem' }}></i>
            <p className="mb-0">{error}</p>
          </div>
        </Alert>
      )}

      {/* Button to navigate to Alerts page */}
      <Button variant="warning" onClick={navigateToAlerts} className="mb-4">
        View Flagged Results ({flaggedResults.length})
      </Button>

      {/* Search results */}
      {searchResults && (
        <Card className="mb-4 dashboard-card slide-up">
          <Card.Header className="d-flex justify-content-between align-items-center bg-light p-3">
            <h5 className="mb-0 font-semibold">Search Results</h5>
            <span className="status-badge info">
              {searchResults.length} {searchResults.length === 1 ? 'match' : 'matches'}
            </span>
          </Card.Header>
          <Card.Body className="p-3">
            {searchResults.length === 0 ? (
              <div className="p-5 text-center">
                <i className="bi bi-search" style={{ fontSize: '3rem', color: '#6c757d', opacity: '0.5' }}></i>
                <h3 className="mt-3 mb-1 font-semibold">No matches found</h3>
                <p className="text-gray-600 mb-0">Try adjusting your search term or filters.</p>
              </div>
            ) : (
              <div>
                <p className="mb-3">Found <span className="text-primary font-semibold">{searchResults.length}</span> potential matches</p>
                {searchResults.map((result, index) => {
                  const similarity = result.similarityPercentage || 0;
                  let badgeClass = "info";
                  if (similarity > 85) badgeClass = "danger";
                  else if (similarity > 70) badgeClass = "warning";
                  
                  return (
                    <Card key={index} className="mb-3 result-card">
                      <Card.Header className="d-flex justify-content-between align-items-center bg-light p-3">
                        <Col xs={5}>
                          <h6 className="mb-0 font-semibold">
                            {result.firstName} {result.secondName} {result.thirdName}
                          </h6>
                        </Col>
                        
                        <Col xs={4} className="text-center">
                          <span className={`status-badge ${badgeClass}`}>
                            Similarity: {result.similarityPercentage}%
                          </span>
                        </Col>
                        
                        <Col className="d-flex justify-content-end">
                          <Button
                            className="btn btn-secondary btn-sm"
                            onClick={() => toggleExpand(index)}
                          >
                            <i className={`bi ${expandedResults[index] ? 'bi-dash-lg' : 'bi-plus-lg'} me-1`}></i>
                            {expandedResults[index] ? 'Hide Details' : 'More Info'}
                          </Button>
                        </Col>
                      </Card.Header>
                      {expandedResults[index] && (
                        <Card.Body className="p-3">
                          <table className="table table-bordered table-sm">
                            <tbody>
                              {result.firstName && <tr><th className="bg-light">First Name</th><td>{result.firstName}</td></tr>}
                              {result.secondName && <tr><th className="bg-light">Second Name</th><td>{result.secondName}</td></tr>}
                              {result.thirdName && <tr><th className="bg-light">Third Name</th><td>{result.thirdName}</td></tr>}
                              {result.full_name && <tr><th className="bg-light">Full Name</th><td>{result.full_name}</td></tr>}
                              {result.aliasNames?.length > 0 && <tr><th className="bg-light">Alias Names</th><td>{result.aliasNames.join(', ')}</td></tr>}
                              {result.source && <tr><th className="bg-light">Source</th><td>{result.source}</td></tr>}
                              {result.type && <tr><th className="bg-light">Type</th><td>{result.type}</td></tr>}
                              {result.country && <tr><th className="bg-light">Country</th><td>{result.country}</td></tr>}
                              {result.similarityPercentage && <tr><th className="bg-light">Similarity %</th><td>{result.similarityPercentage}%</td></tr>}
                              {result.score && <tr><th className="bg-light">Score</th><td>{result.score}</td></tr>}
                            </tbody>
                          </table>
                        </Card.Body>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Stats and actions grid */}
      <div className="mt-4 mb-4">
        <h5 className="mb-3">Dashboard</h5>
        <Row>
          <Col md={4} className="mb-4 slide-up" style={{ animationDelay: '0.1s' }}>
            <Card className="dashboard-card h-100">
              <Card.Body className="p-4">
                <h5 className="text-lg font-medium text-gray-600 mb-3">
                  <i className="bi bi-activity me-2"></i>Today's Activity
                </h5>
                <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
                  <span className="font-medium">Searches</span>
                  <span className="stat-value" style={{ fontSize: '1.25rem' }}>{totalSearches}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="font-medium">Matches</span>
                  <span className="stat-value" style={{ fontSize: '1.25rem' }}>{totalMatches}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4 slide-up" style={{ animationDelay: '0.2s' }}>
            <Card className="dashboard-card h-100">
              <Card.Body className="p-4">
                <h5 className="text-lg font-medium text-gray-600 mb-3">
                  <i className="bi bi-database me-2"></i>Database Status
                </h5>
                <div className="d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded">
                  <span className="font-medium">Total Records</span>
                  <span className="stat-value" style={{ fontSize: '1.25rem' }}>{totalRecords}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="font-medium">Last Updated</span>
                  <span className="stat-value" style={{ fontSize: '1.25rem' }}>{lastUpdated || 'N/A'}</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4} className="mb-4 slide-up" style={{ animationDelay: '0.3s' }}>
            <Card className="dashboard-card h-100">
              <Card.Body className="p-4">
                <h5 className="text-lg font-medium text-gray-600 mb-3">
                  <i className="bi bi-lightning me-2"></i>Quick Actions
                </h5>
                <div className="d-grid gap-2">
                  <Button 
                    className="btn btn-secondary btn-ripple w-100"
                    onClick={() => {
                      fetchDatabaseStatus();
                      setTotalSearches(0);
                      setTotalMatches(0);
                      setSearchResults([]);
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i> Refresh Data
                  </Button>
                  <Button 
                    className="btn btn-secondary btn-ripple w-100" 
                    onClick={() => {
                      if (searchResults && searchResults.length > 0) {
                        exportResultsToTextFile(searchResults);
                      } else {
                        alert('No results to export');
                      }
                    }}
                  >
                    <i className="bi bi-download me-2"></i> Export Results
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default SearchScreen;