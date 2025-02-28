import React, { useState } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';

function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a name to search');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fullName: searchQuery }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Search failed');
      }
      
      setSearchResults(result.data);
    } catch (err) {
      setError(err.message || 'An error occurred during the search');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card className="mb-4">
        <Card.Body>
          <h4 className="mb-3">Advanced Screening</h4>
          <Form onSubmit={handleSearch}>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder="Enter name, entity, or identifier..."
                className="flex-grow-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-secondary">
                <i className="bi bi-funnel"></i> Filters
              </Button>
              <Button variant="dark" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Screen'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Search Results */}
      {searchResults && (
        <Card className="mb-4">
          <Card.Body>
            <h5>Search Results</h5>
            {searchResults.length === 0 ? (
              <Alert variant="info">No matches found for "{searchQuery}"</Alert>
            ) : (
              <div>
                <p>Found {searchResults.length} potential matches for "{searchQuery}"</p>
                {searchResults.map((result, index) => (
                  <Card key={index} className="mb-2">
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6>{result.firstName} {result.secondName} {result.thirdName || ''}</h6>
                          {result.entityName && <p><strong>Entity:</strong> {result.entityName}</p>}
                          {result.aliasNames && result.aliasNames.length > 0 && (
                            <p><strong>Also known as:</strong> {result.aliasNames.join(', ')}</p>
                          )}
                        </div>
                        <Button variant="outline-primary" size="sm">View Details</Button>
                      </div>
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
              <div className="d-flex justify-content-between mb-2">
                <span>Searches</span>
                <span>124</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Matches</span>
                <span>3</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Database Status</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Records</span>
                <span>125,431</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Last Updated</span>
                <span>2h ago</span>
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