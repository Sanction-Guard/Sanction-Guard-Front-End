/**
 * SearchContext.jsx
 * 
 * This file defines the React Context for the search functionality.
 * It provides a central state and functions that can be shared across
 * multiple components in the search interface.
 * 
 * The context has been enhanced to support import-related data and filtering.
 * 
 * @author SanctionGuard Development Team
 * @version 2.0.0
 */

import { createContext, useContext, useState, useEffect } from 'react';

// Create a context for search functionality
const SearchContext = createContext();

/**
 * SearchProvider Component
 * 
 * This component wraps the application (or part of it) to provide
 * access to the search state and functions.
 * 
 * @param {Object} props - Component props including children
 * @returns {JSX.Element} Context provider with children
 */
export const SearchProvider = ({ children }) => {
  // Counter for total searches in the current session
  const [totalSearches, setTotalSearches] = useState(0);
  
  // Counter for total matches found in the current session
  const [totalMatches, setTotalMatches] = useState(0);
  
  // Current search results
  const [searchResults, setSearchResults] = useState([]);
  
  // Collection of analytics data for reporting
  const [analyticsData, setAnalyticsData] = useState([]);
  
  // NEW: Last search date for reference
  const [lastSearchDate, setLastSearchDate] = useState(null);
  
  // NEW: Import-related filter preferences
  const [includeImportedData, setIncludeImportedData] = useState(true);

  const [buttonClickTimes, setButtonClickTimes] = useState([]);
  const [searchResultTimes, setSearchResultTimes] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [totalProcessingTime, setTotalProcessingTime] = useState([]);
  
  /**
   * NEW: Handle performing a search and updating last search date
   * 
   * @param {string} term - Search term
   * @param {string} type - Search type (individual or entity)
   * @returns {Promise<Array>} Search results
   */
  const performSearch = async (term, type) => {
    try {
      // Record the search date
      setLastSearchDate(new Date());
      
      // Increment the search counter
      setTotalSearches(prev => prev + 1);
      
      // Make the API request
      const response = await fetch('http://localhost:3001/api/search/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          searchTerm: term, 
          searchType: type,
          // Include filter preference in the request
          includeImportedData
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      // Parse the results
      const results = await response.json();
      
      // Update the results state
      setSearchResults(results);
      
      // Update the match counter
      setTotalMatches(prev => prev + results.length);
      
      // Return the results for direct use
      return results;
    } catch (error) {
      console.error('Search context error:', error);
      // Rethrow for the calling component to handle
      throw error;
    }
  };
  
  /**
   * NEW: Clear all search results and counters
   */
  const clearSearchData = () => {
    setSearchResults([]);
    setTotalSearches(0);
    setTotalMatches(0);
  };
  
  /**
   * NEW: Export search results to CSV format
   * 
   * @returns {string} CSV content
   */
  const exportResultsToCSV = () => {
    if (!searchResults || searchResults.length === 0) {
      return null;
    }
    
    // Define columns for the CSV
    const columns = [
      'referenceNumber',
      'firstName',
      'secondName',
      'thirdName',
      'name',
      'dateOfBirth',
      'nicNumber',
      'source',
      'listType',
      'similarityPercentage'
    ];
    
    // Create the header row
    const header = columns.join(',');
    
    // Create a row for each result
    const rows = searchResults.map(result => {
      return columns.map(col => {
        // Handle special cases and formatting
        if (col === 'similarityPercentage') {
          return `${result[col] || 0}%`;
        }
        
        // Get the value or empty string
        const value = result[col] || '';
        
        // Escape commas and quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        
        return value;
      }).join(',');
    });
    
    // Combine header and rows
    return [header, ...rows].join('\n');
  };
  
  // Combine all state and functions into a single context value
  const contextValue = {
    // Original state and setters
    totalSearches,
    setTotalSearches,
    totalMatches,
    setTotalMatches,
    searchResults,
    setSearchResults,
    analyticsData,
    setAnalyticsData,
    
    // NEW: Enhanced functionality
    lastSearchDate,
    setLastSearchDate,
    includeImportedData,
    setIncludeImportedData,
    performSearch,
    clearSearchData,
    exportResultsToCSV,

    // buttonClickTimes,
    //   setButtonClickTimes,
    //   searchResultTimes,
    //   setSearchResultTimes,
    //   matchCount,
    //   setMatchCount,
    //   totalProcessingTime,
    //   setTotalProcessingTime,
    //   getRecentActivities,
    //   getSearchMetrics
  };

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
  
  // Provide the context value to child components
  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

/**
 * Custom hook to use the search context
 * 
 * @returns {Object} Search context value
 */
export const useSearch = () => useContext(SearchContext);
