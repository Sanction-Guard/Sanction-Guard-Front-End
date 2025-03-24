// src/services/searchTracker.js
//
// This simplified service tracks search performance metrics
// without requiring any other service dependencies

/**
 * Records search execution time for calculating average processing time
 * @param {number} executionTime - Time in milliseconds
 */
export const recordSearchTiming = (executionTime) => {
  try {
    // Convert to seconds
    const timeInSeconds = executionTime / 1000;
    
    // Get existing timings
    const storedTimings = localStorage.getItem('searchTimings');
    let timings = storedTimings ? JSON.parse(storedTimings) : [];
    
    // Add new timing and keep only last 50
    timings.push(timeInSeconds);
    if (timings.length > 50) {
      timings = timings.slice(-50);
    }
    
    // Store updated timings
    localStorage.setItem('searchTimings', JSON.stringify(timings));
    
    // Update last search info
    const searchInfo = {
      timestamp: new Date().toISOString(),
      executionTime: timeInSeconds
    };
    localStorage.setItem('lastSearchInfo', JSON.stringify(searchInfo));
    
    return timeInSeconds;
  } catch (error) {
    console.error('Error recording search timing:', error);
    return 0;
  }
};

/**
 * Updates total records estimate based on search results
 * @param {number} count - Number of records found
 */
export const updateRecordsEstimate = (count) => {
  try {
    if (!count || count < 1) return;
    
    // Get current estimate
    const currentEstimate = localStorage.getItem('estimatedTotalRecords');
    const parsedEstimate = currentEstimate ? parseInt(currentEstimate) : 0;
    
    // Use the larger value
    const newEstimate = Math.max(parsedEstimate, count);
    
    // Store the estimate
    localStorage.setItem('estimatedTotalRecords', newEstimate.toString());
    
    return newEstimate;
  } catch (error) {
    console.error('Error updating records estimate:', error);
  }
};

/**
 * Updates search history with a new search entry
 * @param {Object} searchData - Search data object
 */
export const updateSearchHistory = (searchData) => {
  try {
    // Get existing history
    const storedHistory = localStorage.getItem('searchHistory');
    let history = storedHistory ? JSON.parse(storedHistory) : [];
    
    // Add new search and keep most recent 20
    history.unshift({
      ...searchData,
      timestamp: new Date().toISOString()
    });
    history = history.slice(0, 20);
    
    // Store updated history
    localStorage.setItem('searchHistory', JSON.stringify(history));
    
    return history;
  } catch (error) {
    console.error('Error updating search history:', error);
    return [];
  }
};

export default {
  recordSearchTiming,
  updateRecordsEstimate,
  updateSearchHistory
};