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
      const response = await fetch('http://54.197.3.150:3001/api/search/search', {
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
    exportResultsToCSV
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
