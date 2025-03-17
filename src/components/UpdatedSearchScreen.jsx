import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import '../styles/Base.css';
import '../styles/layouts/SearchScreen.css';
import '../styles/components/Card.css';
import '../styles/components/Button.css';
import '../styles/components/Form.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';

function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('unknown');
  const [expandedResults, setExpandedResults] = useState({});
  
  // Backend URL - use the same port for all API calls
  const BACKEND_URL = 'http://localhost:3001';

  // Check if backend is accessible
  useEffect(() => {
    const checkBackend = async () => {
      try {
        // Try to ping the backend
        const response = await fetch(`${BACKEND_URL}/`, { 
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          setBackendStatus('connected');
          console.log('Backend connection successful');
        } else {
          setBackendStatus('error');
          console.error('Backend returned status:', response.status);
        }
      } catch (err) {
        setBackendStatus('error');
        console.error('Cannot connect to backend:', err);
      }
    };
    
    checkBackend();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Use the same backend URL constant
      const response = await fetch(`${BACKEND_URL}/api/search`, {
        method: 'POST',
        mode: 'cors', // Enable CORS
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ fullName: searchTerm }),
      });

      // Handle HTTP error statuses
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Get the response as JSON directly
      const result = await response.json();
      console.log('Search result:', result);
      
      // Check if the result has the expected structure
      if (!result.success) {
        throw new Error(result.error || 'Search failed');
      }
      
      // Ensure results are always an array
      let resultData = result.data || [];
      
      // Check if data is an array, if not, try to convert it or wrap it
      if (!Array.isArray(resultData)) {
        console.warn('Search results are not an array:', resultData);
        
        // If it's an object with properties that look like array indices
        if (typeof resultData === 'object' && resultData !== null) {
          // Try to convert object to array if it has numeric keys
          const tempArray = Object.values(resultData);
          if (tempArray.length > 0) {
            resultData = tempArray;
          } else {
            // Wrap the object in an array as a fallback
            resultData = [resultData];
          }
        } else {
          // Last resort: create an array with one item
          resultData = [resultData];
        }
      }
      
      console.log('Processed search results:', resultData);
      setSearchResults(resultData);
      setExpandedResults({});
      
    } catch (err) {
      console.error('Search error:', err);
      setError(`Error searching: ${err.message}`);
      
      // Set empty array on error rather than null
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Format the date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      // Check if it's already in a DD.MM.YYYY format
      if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) {
        return dateString;
      }
      
      // Try to parse as ISO date
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? dateString // If invalid, return the original string
        : date.toISOString().split('T')[0].split('-').reverse().join('.');
    } catch (e) {
      return dateString;
    }
  };

  // Toggle expanded view for a result
  const toggleExpand = (index) => {
    setExpandedResults((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Calculate similarity score (for demonstration purposes)
  const calculateSimilarity = (result, index) => {
    // This is just a placeholder function - in real use, you might want to 
    // use an actual similarity score from your backend
    if (result.similarityPercentage) return result.similarityPercentage;
    if (result.similarity) return result.similarity * 100;
    
    // Random similarity as fallback for demo purposes
    return Math.round(100 - (index * 15)); 
  };

  return (
    <Container className="search-container fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Search</h1>
        <p className="text-gray-600">Search for individuals or entities in our database</p>
      </div>
      
      {/* Backend connection error alert */}
      {backendStatus === 'error' && (
        <Card className="mb-4 border-left-warning slide-up">
          <Card.Body className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle text-warning mr-3" style={{ fontSize: '1.25rem' }}></i>
            <p className="mb-0">Could not connect to backend server. Make sure it's running on port 3001.</p>
          </Card.Body>
        </Card>
      )}
      
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
              <Button variant="outline-secondary" className="btn btn-secondary">
                <i className="bi bi-funnel me-1"></i> Filters
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                className="btn btn-primary btn-ripple"
                disabled={loading || backendStatus === 'error'}
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
        <Card className="mb-4 border-left-danger slide-up">
          <Card.Body className="d-flex align-items-center">
            <i className="bi bi-x-circle text-danger mr-3" style={{ fontSize: '1.25rem' }}></i>
            <p className="mb-0">{error}</p>
          </Card.Body>
        </Card>
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
          <Card.Body className="p-0">
            {searchResults.length === 0 ? (
              <div className="p-5 text-center">
                <i className="bi bi-search" style={{ fontSize: '3rem', color: '#6c757d', opacity: '0.5' }}></i>
                <h3 className="mt-3 mb-1 font-semibold">No matches found</h3>
                <p className="text-gray-600 mb-0">Try adjusting your search term or filters.</p>
              </div>
            ) : (
              <div className="p-3">
                {searchResults.map((result, index) => {
                  const similarity = calculateSimilarity(result, index);
                  let badgeClass = 'info';
                  if (similarity > 80) badgeClass = 'danger';
                  else if (similarity > 60) badgeClass = 'warning';
                  
                  return (
                    <Card key={index} className="mb-3 result-card">
                      <Card.Header className="d-flex justify-content-between align-items-center bg-light p-3">
                        <div>
                          <h6 className="mb-0 font-semibold">
                            {result.firstName || ''} {result.secondName || ''} {result.thirdName || ''}
                            {!result.firstName && !result.secondName && !result.thirdName && 
                              (result.reference_number ? 
                                `Individual ${result.reference_number.split('/').pop()}` : 
                                `Individual ${index + 1}`)}
                          </h6>
                          {result.nic && <small className="text-muted">NIC: {result.nic}</small>}
                        </div>

                        <div className="d-flex align-items-center">
                          <span className={`status-badge ${badgeClass} me-3`}>
                            Similarity: {similarity}%
                          </span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            className="btn btn-sm btn-secondary"
                            onClick={() => toggleExpand(index)}
                          >
                            <i className={`bi ${expandedResults[index] ? 'bi-dash-lg' : 'bi-plus-lg'} me-1`}></i>
                            {expandedResults[index] ? 'Hide Details' : 'View Details'}
                          </Button>
                        </div>
                      </Card.Header>
                      
                      {expandedResults[index] && (
                        <Card.Body className="p-3">
                          <div className="border rounded overflow-hidden">
                            <table className="table table-bordered mb-0">
                              <tbody>
                                {result._id && (
                                  <tr>
                                    <th className="bg-light w-25">ID</th>
                                    <td>{result._id}</td>
                                  </tr>
                                )}
                                {result.reference_number && (
                                  <tr>
                                    <th className="bg-light">Reference</th>
                                    <td>{result.reference_number}</td>
                                  </tr>
                                )}
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
                                {result.dob && (
                                  <tr>
                                    <th className="bg-light">Date of Birth</th>
                                    <td>{formatDate(result.dob)}</td>
                                  </tr>
                                )}
                                {result.nic && (
                                  <tr>
                                    <th className="bg-light">NIC</th>
                                    <td>{result.nic}</td>
                                  </tr>
                                )}
                                {result.aka && result.aka.length > 0 && (
                                  <tr>
                                    <th className="bg-light">Also Known As</th>
                                    <td>{result.aka.join(', ')}</td>
                                  </tr>
                                )}
                                {result.created_at && (
                                  <tr>
                                    <th className="bg-light">Created At</th>
                                    <td>{new Date(result.created_at).toLocaleString()}</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
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
                  <span className="stat-value" style={{ fontSize: '1.25rem' }}>124</span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="font-medium">Matches</span>
                  <span className="stat-value" style={{ fontSize: '1.25rem' }}>3</span>
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
                  <span className="stat-value" style={{ fontSize: '1.25rem' }}>125,431</span>
                </div>
                <div className="d-flex justify-content-between align-items-center p-2 bg-light rounded">
                  <span className="font-medium">Last Updated</span>
                  <span className="stat-value" style={{ fontSize: '1.25rem' }}>2h ago</span>
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
                  <Button className="btn btn-secondary btn-ripple w-100">
                    <i className="bi bi-arrow-clockwise me-2"></i> Refresh Data
                  </Button>
                  <Button className="btn btn-secondary btn-ripple w-100">
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