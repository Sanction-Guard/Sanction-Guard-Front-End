import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner, Dropdown } from 'react-bootstrap';
import { useSearch } from './SearchContext';
import ReportsAnalytics from "./ReportsAnalytics";
import '../styles/layouts/SearchScreen.css';
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Button.css';
import '../styles/components/Form.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';

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

  const [buttonClickTimes, setButtonClickTimes] = useState([]);
  const [searchResultTimes, setSearchResultTimes] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {

      const clickTime = new Date();
      setButtonClickTimes(prev => [...prev, {
        action: 'Search Button Click',
        timestamp: clickTime.toISOString(),
        searchTerm
      }]);

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

      const resultTime = new Date();
      setSearchResultTimes(prev => [...prev, {
        action: 'Search Results Displayed',
        timestamp: resultTime.toISOString(),
        searchTerm,
        searchType, // Adding searchType for more complete data
        resultCount: results.length,
        matchDetails: results.length > 0 ? {
          topMatchSimilarity: results[0].similarityPercentage || 0,
          sourcesFound: [...new Set(results.map(r => r.source).filter(Boolean))]
        } : null
      }]);

      

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

  // Function to export data as CSV
  const exportData = () => {
    // Create a more structured export with explicit search history
    const searchHistory = searchResultTimes.map(result => ({
      timestamp: result.timestamp,
      searchTerm: result.searchTerm,
      searchType: result.searchType || 'individual', // Default if not recorded
      matchCount: result.resultCount,
      matchDetails: result.matchDetails || null
    }));
  
    // Create export data object
    const exportData = {
      summary: {
        totalSearches,
        totalMatches,
        currentTime: new Date().toISOString()
      },
      searchHistory,
      buttonClickEvents: buttonClickTimes,
      analyticsData
    };

    // Convert to CSV or JSON
    const dataStr = JSON.stringify(exportData, null, 2);
    
    // Create download link
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // Create temporary link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-activity-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // Function to handle refresh button click
  const handleRefreshClick = () => {
    // Record button click time
    const clickTime = new Date();
    setButtonClickTimes(prev => [...prev, {
      action: 'Refresh Button Click',
      timestamp: clickTime.toISOString()
    }]);
    
    fetchDatabaseStatus();
    setTotalSearches(0);
    setTotalMatches(0);
    setSearchResults(null);
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
                              {result.firstName && (
                                <tr>
                                  <th className="bg-light">First Name</th>
                                  <td>{result.firstName}</td>
                                </tr>
                              )}
                              {result.secondName && (
                                <tr>
                                  <th className="bg-light">Second Name</th>
                                  <td>{result.secondName}</td>
                                </tr>
                              )}
                              {result.thirdName && (
                                <tr>
                                  <th className="bg-light">Third Name</th>
                                  <td>{result.thirdName}</td>
                                </tr>
                              )}
                              {result.full_name && (
                                <tr>
                                  <th className="bg-light">Full Name</th>
                                  <td>{result.full_name}</td>
                                </tr>
                              )}
                              {result.aliasNames && result.aliasNames.length > 0 && (
                                <tr>
                                  <th className="bg-light">Alias Names</th>
                                  <td>{result.aliasNames.join(', ')}</td>
                                </tr>
                              )}
                              {result.source && (
                                <tr>
                                  <th className="bg-light">Source</th>
                                  <td>{result.source}</td>
                                </tr>
                              )}
                              {result.type && (
                                <tr>
                                  <th className="bg-light">Type</th>
                                  <td>{result.type}</td>
                                </tr>
                              )}
                              {result.country && (
                                <tr>
                                  <th className="bg-light">Country</th>
                                  <td>{result.country}</td>
                                </tr>
                              )}
                              {result.similarityPercentage && (
                                <tr>
                                  <th className="bg-light">Similarity %</th>
                                  <td>{result.similarityPercentage}%</td>
                                </tr>
                              )}
                              {result.score && (
                                <tr>
                                  <th className="bg-light">Score</th>
                                  <td>{result.score}</td>
                                </tr>
                              )}
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
                      setSearchResults(null);
                    }}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i> Refresh Data
                  </Button>
                  <Button 
                    className="btn btn-secondary btn-ripple w-100" 
                    onClick={exportData}
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