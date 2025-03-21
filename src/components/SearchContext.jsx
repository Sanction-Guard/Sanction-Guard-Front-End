import { createContext, useContext, useState, useEffect } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [totalSearches, setTotalSearches] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]); 
  const [buttonClickTimes, setButtonClickTimes] = useState([]);
  const [searchResultTimes, setSearchResultTimes] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [totalProcessingTime, setTotalProcessingTime] = useState([]);
  
  // Calculate average processing time between search button clicks and results
const calculateAvgProcessingTime = () => {
  // Add debug logging to see what data we're working with
  console.log("Button clicks:", buttonClickTimes);
  console.log("Search results:", searchResultTimes);
  
  if (!buttonClickTimes.length || !searchResultTimes.length) {
    console.log("No data for calculation");
    return "0.0";
  }
  
  let totalProcessingTime = 0;
  let countedPairs = 0;
  
  // Match button clicks with their results by searchTerm
  buttonClickTimes.forEach(clickEvent => {
    console.log("Processing click event:", clickEvent);
    
    if (clickEvent.action === "Search Button Click" && clickEvent.searchTerm) {
      // Find corresponding result event that occurs after this click
      const matchingResults = searchResultTimes.filter(
        result => result.searchTerm === clickEvent.searchTerm && 
                 new Date(result.timestamp) > new Date(clickEvent.timestamp)
      );
      
      console.log(`Found ${matchingResults.length} matching results for term "${clickEvent.searchTerm}"`);
      
      // Sort by timestamp to find the closest match
      if (matchingResults.length > 0) {
        const closestResult = matchingResults.sort((a, b) => 
          new Date(a.timestamp) - new Date(b.timestamp)
        )[0];
        
        const clickTime = new Date(clickEvent.timestamp);
        const resultTime = new Date(closestResult.timestamp);
        const timeDiffInSeconds = (resultTime - clickTime) / 1000;
        
        console.log(`Time difference: ${timeDiffInSeconds}s between click and result`);
        
        totalProcessingTime += timeDiffInSeconds;
        countedPairs++;
      }
    }
  });
  
  console.log(`Total processing time: ${totalProcessingTime}, counted pairs: ${countedPairs}`);
  
  return countedPairs > 0 ? (totalProcessingTime / countedPairs).toFixed(1) : "0.0";
};
  
  // Format activities for the dashboard
  const getRecentActivities = () => {
    // Combine button clicks and search results into a single activity list
    const allActivities = [
      ...buttonClickTimes.map(event => ({
        id: event.timestamp,
        action: event.action,
        user: 'Current User',
        time: formatTimeAgo(event.timestamp),
        status: 'success',
        searchTerm: event.searchTerm || ''
      })),
      ...searchResultTimes.map(event => ({
        id: event.timestamp,
        action: event.action,
        user: 'System',
        time: formatTimeAgo(event.timestamp),
        status: event.resultCount > 0 ? 'success' : 'warning',
        searchTerm: event.searchTerm || ''
      }))
    ];
    
    // Sort by timestamp, newest first
    return allActivities.sort((a, b) => new Date(b.id) - new Date(a.id)).slice(0, 5);
  };
  
  // Helper to format relative time
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const eventTime = new Date(timestamp);
    const diffMs = now - eventTime;
    
    const diffSeconds = Math.floor(diffMs / 1000);
    if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
    
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };
  
  // Generate metrics for dashboard cards
  const getSearchMetrics = () => {
    // Prepare data for charts
    // Use search result counts from the last 9 searches
    const searchCounts = searchResultTimes.slice(-9).map(item => ({ 
      value: item.resultCount || 0 
    }));
    
    // If we don't have 9 entries yet, pad with zeros
    while (searchCounts.length < 9) {
      searchCounts.unshift({ value: 0 });
    }
    
    // Create processing time trend data
    const processingTimes = [];
    let prevValue = 5.0; // Starting value
    
    for (let i = 0; i < 9; i++) {
      // Simulate a downward trend in processing time (improving performance)
      const randomChange = Math.random() * 0.5;
      const newValue = prevValue > 3.0 ? prevValue - randomChange : prevValue;
      processingTimes.push({ value: newValue });
      prevValue = newValue;
    }
    
    // Use actual processing time if available for the most recent value
    const avgTime = calculateAvgProcessingTime();
    if (avgTime !== "0.0") {
      processingTimes[processingTimes.length - 1].value = parseFloat(avgTime);
    }
    
    return [
      { 
        id: 1, 
        title: 'Total Records', 
        value: totalMatches.toString(), 
        trend: 'up', 
        percentage: '12.5', 
        color: '#4361ee',
        data: matchCount
      },
      { 
        id: 2, 
        title: 'Avg. Processing Time', 
        value: `${avgTime}s`, 
        trend: 'down', 
        percentage: '8.7', 
        color: '#3f37c9',
        data: processingTimes
      }
    ];
  };
  
  return (
    <SearchContext.Provider value={{
      totalSearches,
      setTotalSearches,
      totalMatches,
      setTotalMatches,
      searchResults,
      setSearchResults,
      analyticsData,
      setAnalyticsData,
      buttonClickTimes,
      setButtonClickTimes,
      searchResultTimes,
      setSearchResultTimes,
      matchCount,
      setMatchCount,
      totalProcessingTime,
      setTotalProcessingTime,
      getRecentActivities,
      getSearchMetrics
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);