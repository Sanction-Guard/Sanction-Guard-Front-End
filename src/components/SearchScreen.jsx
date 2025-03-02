import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import stringSimilarity from 'string-similarity';


function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedResults, setExpandedResults] = useState({}); // Track expanded results
  const [totalSearches, setTotalSearches] = useState(0); // Track total searches
  const [totalMatches, setTotalMatches] = useState(0); // Track total matches

  // Database status for quick actions
  const [totalRecords, setTotalRecords] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Elasticsearch credentials and endpoint
  const ELASTICSEARCH_URL = 'http://34.238.157.184:9200';
  const ELASTICSEARCH_INDEX = 'sanction_names';
  const ELASTICSEARCH_USERNAME = 'elastic';
  const ELASTICSEARCH_PASSWORD = 'm8m3g9dZ1LsA2cTUpcd1';

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setTotalSearches((prev) => prev + 1); // Increment search count

      // Elasticsearch query
      const query = {
        query: {
          multi_match: {
            query: searchTerm,
            fields: ["firstName", "secondName", "thirdName", "full_name", "aka", "aliasNames"],
            fuzziness: "AUTO"
          }
        },
        size: 1000
      };

      // Make the request to Elasticsearch
      const response = await fetch(`${ELASTICSEARCH_URL}/${ELASTICSEARCH_INDEX}/_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${ELASTICSEARCH_USERNAME}:${ELASTICSEARCH_PASSWORD}`)}`
        },
        body: JSON.stringify(query),
      });

      // Handle HTTP error statuses
      if (!response.ok) {
        throw new Error(`Elasticsearch responded with status: ${response.status}`);
      }

      // Get the response as JSON directly
      const result = await response.json();
      console.log('Elasticsearch result:', result);

      // Extract hits from the response
      const hits = result.hits?.hits || [];
      const maxScore = Math.max(...hits.map(hit => hit._score || 0));

      // Map hits to include the matched name and similarity score
      const formattedResults = hits.map(hit => {
        const dbName = `${hit._source.firstName || ''} ${hit._source.secondName || ''} ${hit._source.thirdName || ''}`.trim();
        const similarity = stringSimilarity.compareTwoStrings(searchTerm.toLowerCase(), dbName.toLowerCase());
        
        return {
          ...hit._source,
          score: hit._score,
          similarityPercentage: (similarity * 100).toFixed(2)
        };
      });

      // Filter results with similarity percentage > 50
      const filteredResults = formattedResults.filter(result => result.similarityPercentage > 50);

      // Sort in descending order of similarityPercentage
      formattedResults.sort((a, b) => b.similarityPercentage - a.similarityPercentage);

    
      console.log('Processed search results:', formattedResults);
      setSearchResults(formattedResults);
      setExpandedResults({}); // Reset expanded results
      setTotalMatches((prev) => prev + hits.length); // Update total matches

    } catch (err) {
      console.error('Search error:', err);
      setError(`Error searching: ${err.message}`);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch database status for quick actions
  const fetchDatabaseStatus = async () => {
    try {
      // Fetch total records
      const countResponse = await fetch(`${ELASTICSEARCH_URL}/${ELASTICSEARCH_INDEX}/_count`, {
        headers: {
          'Authorization': `Basic ${btoa(`${ELASTICSEARCH_USERNAME}:${ELASTICSEARCH_PASSWORD}`)}`
        }
      });

      if (!countResponse.ok) {
        throw new Error('Failed to fetch total records');
      }

      const countData = await countResponse.json();
      setTotalRecords(countData.count);

      // Fetch the most recent document by created_at
      const latestResponse = await fetch(`${ELASTICSEARCH_URL}/${ELASTICSEARCH_INDEX}/_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${ELASTICSEARCH_USERNAME}:${ELASTICSEARCH_PASSWORD}`)}`
        },
        body: JSON.stringify({
          size: 1,
          sort: [{ "created_at": { "order": "desc" } }],
          _source: ["created_at"]
        }),
      });

      if (!latestResponse.ok) {
        throw new Error('Failed to fetch last updated time');
      }

      const latestData = await latestResponse.json();
      const latestHit = latestData.hits?.hits[0]?._source?.created_at;

      if (latestHit) {
        setLastUpdated(new Date(latestHit).toLocaleString());
      } else {
        setLastUpdated('N/A');
      }

    } catch (err) {
      console.error('Error fetching database status:', err);
      setTotalRecords(0);
      setLastUpdated('Error');
    }
  };

  // Fetch database status on component mount
  useEffect(() => {
    fetchDatabaseStatus();
  }, []);

  // Toggle expanded view for a specific result
  const toggleExpand = (index) => {
    setExpandedResults((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the expanded state for this index
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
              <Button variant="outline-secondary">
                <i className="bi bi-funnel"></i> Filters
              </Button>
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

                      <Col>
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
                        <pre className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
{`{
  ${result._id ? `_id: ${result._id},` : ''}
  ${result.reference_number ? `reference_number: '${result.reference_number}',` : ''}
  ${result.__v !== undefined ? `__v: ${result.__v},` : ''}
  ${result.aka && result.aka.length ? `aka: [${result.aka.map(name => `'${name}'`).join(', ')}],` : ''}
  ${result.created_at ? `created_at: '${new Date(result.created_at).toISOString()}',` : ''}
  ${result.dob ? `dob: '${result.dob}',` : ''}
  ${result.firstName ? `firstName: '${result.firstName}',` : ''}
  ${result.nic ? `nic: '${result.nic}',` : ''}
  ${result.secondName ? `secondName: '${result.secondName}',` : ''}
  ${result.thirdName ? `thirdName: '${result.thirdName}'` : ''}
${Object.keys(result)
  .filter(key => !['id', 'reference_number', '__v', 'aka', 'created_at', 'dob', 'firstName', 'nic', 'secondName', 'thirdName'].includes(key))
  .map(key => `  ${key}: ${typeof result[key] === 'string' ? `'${result[key]}'` : JSON.stringify(result[key])},`)
  .join('\n')}
}`}
                        </pre>
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
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Today's Activity</h5>
              <div className="d-flex justify-content-between mb-2">
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
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Database Status</h5>
              <div className="d-flex justify-content-between mb-2">
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
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Quick Actions</h5>
              <div className="d-grid gap-2">
                <Button variant="outline-primary" onClick={() => {
                  fetchDatabaseStatus();
                  setTotalSearches(0);
                  setTotalMatches(0);
                  setSearchResults(null);
                }}>
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