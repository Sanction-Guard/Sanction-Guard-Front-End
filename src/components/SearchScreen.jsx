import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';

function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState('unknown');
  
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

  return (
    <Container>
      {backendStatus === 'error' && (
        <Alert variant="warning" className="mt-3">
          Could not connect to backend server. Make sure it's running on port 3001.
        </Alert>
      )}
      
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
              <Button variant="outline-secondary">
                <i className="bi bi-funnel"></i> Filters
              </Button>
              <Button 
                variant="dark" 
                type="submit" 
                disabled={loading || backendStatus === 'error'}
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
                      <h6 className="mb-0">
                        {result.reference_number ? 
                          `Individual ${result.reference_number.split('/').pop()}` : 
                          `Individual ${index + 1}`}
                      </h6>
                      <Button variant="outline-primary" size="sm">View Details</Button>
                    </Card.Header>
                    <Card.Body>
                      <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
{`{
  ${result._id ? `_id: ${result._id},` : ''}
  ${result.reference_number ? `reference_number: '${result.reference_number}',` : ''}
  ${result.__v !== undefined ? `__v: ${result.__v},` : ''}
  ${result.aka && result.aka.length ? `aka: [${result.aka.map(name => ` '${name}'`)}],` : ''}
  ${result.created_at ? `created_at: ${new Date(result.created_at).toISOString()},` : ''}
  ${result.dob ? `dob: '${result.dob}',` : ''}
  ${result.firstName ? `firstName: '${result.firstName}',` : ''}
  ${result.nic ? `nic: '${result.nic}',` : ''}
  ${result.secondName ? `secondName: '${result.secondName}',` : ''}
  ${result.thirdName ? `thirdName: '${result.thirdName}'` : ''}
${Object.keys(result)
  .filter(key => !['_id', 'reference_number', '__v', 'aka', 'created_at', 'dob', 'firstName', 'nic', 'secondName', 'thirdName'].includes(key))
  .map(key => `  ${key}: ${typeof result[key] === 'string' ? `'${result[key]}'` : JSON.stringify(result[key])},`)
  .join('\n')}
}`}
                      </pre>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      <Row>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Today's Activity</h5>
              {/* CHAVISHKA TRY TO IMPLEMENT THIS */}
              <div className="d-flex justify-content-between mb-2">
                <span>Searches</span>
                <span>N/A</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Matches</span>
                <span>N/A</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Database Status</h5>
              {/* TODO: Implement dynamic database status from backend */}
              <div className="d-flex justify-content-between mb-2">
                <span>Total Records</span>
                <span>N/A</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Last Updated</span>
                <span>N/Ah ago</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Quick Actions</h5>
              <div className="d-grid gap-2">
                <Button variant="outline-primary">
                  <i className="bi bi-arrow-clockwise"></i> Refresh Data
                </Button>
                <Button variant="outline-secondary">
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