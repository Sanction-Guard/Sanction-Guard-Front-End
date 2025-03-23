
const ELASTICSEARCH_URL = 'http://34.238.157.184:9200';
const ELASTICSEARCH_INDEX = 'sanction_names';
const ELASTICSEARCH_USERNAME = 'elastic';
const ELASTICSEARCH_PASSWORD = 'm8m3g9dZ1LsA2cTUpcd1';

/**
 * Send batch data to Elasticsearch for matching.
 * @param {Array} data - Array of entities to screen.
 */
export const processBatch = async (data) => {
  try {
    const results = [];

    // Process each name in the batch
    for (const entity of data) {
      const response = await fetch(`${ELASTICSEARCH_URL}/${ELASTICSEARCH_INDEX}/_search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`${ELASTICSEARCH_USERNAME}:${ELASTICSEARCH_PASSWORD}`)}`
        },
        body: JSON.stringify({
          query: {
            multi_match: {
              query: entity.name, // Assuming 'name' is the field to match
              fields: ["firstName", "secondName", "thirdName", "full_name", "aka", "aliasNames"],
              fuzziness: "AUTO"
            }
          },
          size: 5 // Fetch top 5 matches
        }),
      });

      if (!response.ok) {
        throw new Error(`Elasticsearch responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Elasticsearch results for:', entity.name, result.hits.hits);

      // Add the top 5 matches to the results
      results.push({
        name: entity.name,
        matches: result.hits.hits.map((hit) => ({
          score: hit._score,
          data: hit._source,
        })),
      });
    }

    return results;
  } catch (err) {
    console.error('Error processing batch:', err);
    throw err;
  }
};