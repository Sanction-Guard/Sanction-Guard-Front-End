import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner, Dropdown, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSearch } from './SearchContext';
import '../styles/layouts/SearchScreen.css';
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Button.css';
import '../styles/components/Form.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';

/**
 * SearchScreen Component
 * 
 * This component provides the main search interface for SanctionGuard.
 * It handles searching for individuals and entities in the sanctions database
 * and displays the results with similarity scores.
 * 
 * The component has been modified to better display imported data from CSV files
 * by adding source information and improved result display.
 * 
 * @returns {JSX.Element} The search screen UI
 */
function SearchScreen() {
  // Get search context values and functions
  const { 
    totalSearches, 
    setTotalSearches, 
    totalMatches, 
    setTotalMatches, 
    searchResults, 
    setSearchResults 
  } = useSearch();
  
  // Local state for search form and results
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
  
  // State for showing import information
  const [showImportInfo, setShowImportInfo] = useState(false);
  const [importStats, setImportStats] = useState({ 
    totalImported: 0, 
    recentImports: [] 
  });

  /**
   * Handle search form submission
   * Sends search request to API and processes results
   * 
   * @async
   * @returns {void}
   */
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTotalSearches((prev) => prev + 1);

      // Fixed: Removed trailing question mark from URL
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

      // Try to log search data, but don't fail the main search if logging fails
      try {
        // Fixed: Use consistent endpoint and removed trailing question mark from URL
        // Also using endpoint from the second file which had "search?" instead of "log"
        const logResponse = await fetch('http://localhost:3001/api/search/search', {
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
          console.warn('Failed to log search data, but search was successful');
        }
      } catch (logErr) {
        // Don't let logging errors affect the main search functionality
        console.warn('Error logging search:', logErr);
      }
  
      // Only add analytics data if we have results above threshold
      if (filteredResults.length > 0) {
        setAnalyticsData(prev => [
          ...prev,
          {
            searchedName: searchTerm,
            matchedName: filteredResults[0].fullName || filteredResults[0].firstName + ' ' + filteredResults[0].secondName,
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

  /**
   * Fetch database status to display record counts and last update
   * 
   * @async
   * @returns {void}
   */
  const fetchDatabaseStatus = async () => {
    try {
      // Make API request to status endpoint
      // Try the enhanced endpoint first
      let response = await fetch('http://localhost:3001/api/search/status');
      
      // If that fails, try the alternative endpoint
      if (!response.ok) {
        response = await fetch('http://localhost:3001/api/audit-logs');
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch database status');
      }

      // Parse response and update state
      const status = await response.json();
      setTotalRecords(status.totalRecords);
      setLastUpdated(status.lastUpdated);

      // Fetch import statistics
      fetchImportStats();
    } catch (err) {
      console.error('Error fetching database status:', err);
      setTotalRecords(0);
      setLastUpdated('Error');
    }
  };

  /**
   * Fetch import statistics from the API
   * 
   * @async
   * @returns {void}
   */
  const fetchImportStats = async () => {
    try {
      // Make API request to imports endpoint
      const response = await fetch('http://localhost:3001/api/imports/recent');
      if (!response.ok) {
        throw new Error('Failed to fetch import statistics');
      }

      // Parse response and update import stats
      const recentImports = await response.json();
      
      // Calculate total imported records
      const totalImported = recentImports.reduce((total, imp) => {
        return total + (imp.entriesUpdated || 0);
      }, 0);
      
      // Update import stats state
      setImportStats({ 
        totalImported, 
        recentImports 
      });
    } catch (err) {
      console.error('Error fetching import stats:', err);
    }
  };

  // Fetch database status when component mounts
  useEffect(() => {
    fetchDatabaseStatus();
  }, []);

  /**
   * Toggle expanding/collapsing result details
   * 
   * @param {number} index - Index of the result to toggle
   * @returns {void}
   */
  const toggleExpand = (index) => {
    setExpandedResults((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  /**
   * Format a date string for better display
   * 
   * @param {string} dateStr - Date string to format
   * @returns {string} Formatted date
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  };

  /**
   * Get bootstrap color class based on similarity percentage
   * 
   * @param {number} similarity - Similarity percentage
   * @returns {string} Bootstrap color class
   */
  const getSimilarityColorClass = (similarity) => {
    if (similarity > 85) return "danger";
    if (similarity > 70) return "warning";
    if (similarity > 50) return "primary";
    return "info";
  };

  /**
   * Format import source to be more user-friendly
   * 
   * @param {string} source - Source string from API
   * @returns {string} Formatted source text
   */
  const formatSource = (source) => {
    if (!source) return 'Unknown';
    
    if (source.includes('CSV Import')) {
      return source.replace('CSV Import - ', '');
    }
    
    return source;
  };

  /**
   * Render a source badge with appropriate color
   * 
   * @param {string} source - Source string from API
   * @returns {JSX.Element} Badge component
   */
  const renderSourceBadge = (source) => {
    let variant = 'secondary';
    
    if (source?.includes('Local')) {
      variant = 'success';
    } else if (source?.includes('UN')) {
      variant = 'primary';
    } else if (source?.includes('Import')) {
      variant = 'info';
    }
    
    return (
      <Badge bg={variant} className="me-2">
        {formatSource(source)}
      </Badge>
    );
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
      <div className="mb-4 slide-up">
        <Button variant="warning" onClick={navigateToAlerts} className="w-100" id="view-flagged">
          <i className="bi bi-flag-fill me-2"></i>
          View Flagged Results ({flaggedResults.length})
        </Button>
      </div>

      {/* Search results */}
      {searchResults && searchResults.length > 0 && (
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
                  const similarity = parseFloat(result.similarityPercentage) || 0;
                  let badgeClass = getSimilarityColorClass(similarity);
                  
                  return (
                    <Card key={index} className="mb-3 result-card">
                      <Card.Header className="d-flex justify-content-between align-items-center bg-light p-3">
                        <Col xs={5}>
                          <h6 className="mb-0 font-semibold">
                            {result.firstName} {result.secondName} {result.thirdName || result.name}
                          </h6>
                          {/* Show source badge */}
                          <div className="mt-1">
                            {renderSourceBadge(result.source)}
                            {result.listType && (
                              <Badge bg="secondary" className="me-1">{result.listType}</Badge>
                            )}
                          </div>
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
                              {result.name && (
                                <tr>
                                  <th className="bg-light">Entity Name</th>
                                  <td>{result.name}</td>
                                </tr>
                              )}
                              {result.full_name && (
                                <tr>
                                  <th className="bg-light">Full Name</th>
                                  <td>{result.full_name}</td>
                                </tr>
                              )}
                              {/* Show reference number */}
                              {result.referenceNumber && (
                                <tr>
                                  <th className="bg-light">Reference Number</th>
                                  <td>{result.referenceNumber}</td>
                                </tr>
                              )}
                              {result.dateOfBirth && (
                                <tr>
                                  <th className="bg-light">Date of Birth</th>
                                  <td>{formatDate(result.dateOfBirth)}</td>
                                </tr>
                              )}
                              {result.nicNumber && (
                                <tr>
                                  <th className="bg-light">NIC Number</th>
                                  <td>{result.nicNumber}</td>
                                </tr>
                              )}
                              {result.aliasNames && result.aliasNames.length > 0 && (
                                <tr>
                                  <th className="bg-light">Alias Names</th>
                                  <td>{result.aliasNames.join(', ')}</td>
                                </tr>
                              )}
                              {/* Show addresses for entities */}
                              {result.addresses && result.addresses.length > 0 && (
                                <tr>
                                  <th className="bg-light">Addresses</th>
                                  <td>
                                    <ul className="mb-0 ps-3">
                                      {result.addresses.map((address, i) => (
                                        <li key={i}>{address}</li>
                                      ))}
                                    </ul>
                                  </td>
                                </tr>
                              )}
                              {result.source && (
                                <tr>
                                  <th className="bg-light">Source</th>
                                  <td>{result.source}</td>
                                </tr>
                              )}
                              {/* Show source file for imports */}
                              {result.sourceFile && (
                                <tr>
                                  <th className="bg-light">Source File</th>
                                  <td>{result.sourceFile}</td>
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
                                  <td>
                                    <div className="progress" style={{ height: '20px' }}>
                                      <div 
                                        className={`progress-bar bg-${badgeClass}`} 
                                        role="progressbar" 
                                        style={{ width: `${result.similarityPercentage}%` }}
                                        aria-valuenow={result.similarityPercentage} 
                                        aria-valuemin="0" 
                                        aria-valuemax="100"
                                      >
                                        {result.similarityPercentage}%
                                      </div>
                                    </div>
                                  </td>
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
                {/* Show imported records count */}
                {importStats.totalImported > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-3 p-2 bg-light rounded">
                    <span className="font-medium">Imported Records</span>
                    <span className="stat-value" style={{ fontSize: '1.25rem' }}>{importStats.totalImported}</span>
                  </div>
                )}
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
                  {/* Show import information button */}
                  <Button 
                    className="btn btn-secondary btn-ripple w-100"
                    onClick={() => setShowImportInfo(!showImportInfo)}
                  >
                    <i className="bi bi-file-earmark-arrow-down me-2"></i> Import Information
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
      
      {/* Import information section */}
      {showImportInfo && (
        <div className="mt-4 mb-4 slide-up">
          <Card className="dashboard-card">
            <Card.Header className="d-flex justify-content-between align-items-center bg-light p-3">
              <h5 className="mb-0 font-semibold">Recent Imports</h5>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => setShowImportInfo(false)}
              >
                <i className="bi bi-x-lg"></i>
              </Button>
            </Card.Header>
            <Card.Body className="p-3">
              {importStats.recentImports.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
                  <p className="text-gray-600">No recent imports found</p>
                  <p className="text-gray-500 small">Visit the Import section to upload CSV files</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Filename</th>
                        <th>Status</th>
                        <th>Records</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {importStats.recentImports.map((imp, index) => (
                        <tr key={imp._id || index}>
                          <td>{imp.filename}</td>
                          <td>
                            <Badge 
                              bg={imp.status === 'completed' ? 'success' : 
                                 imp.status === 'failed' ? 'danger' : 
                                 imp.status === 'processing' ? 'warning' : 'info'}
                            >
                              {imp.status}
                            </Badge>
                          </td>
                          <td>{imp.entriesUpdated || 0}</td>
                          <td>{formatDate(imp.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="text-center mt-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate('/import')}
                >
                  <i className="bi bi-arrow-right me-1"></i> Go to Import Section
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </Container>
  );
}

export default SearchScreen;