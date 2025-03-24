import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const SearchContext = createContext();

// Create provider component
export const SearchProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [totalSearches, setTotalSearches] = useState(() => {
    const saved = localStorage.getItem('totalSearches');
    return saved ? parseInt(saved) : 0;
  });
  
  const [totalMatches, setTotalMatches] = useState(() => {
    const saved = localStorage.getItem('totalMatches');
    return saved ? parseInt(saved) : 0;
  });
  
  const [searchResults, setSearchResults] = useState([]);
  
  const [searchPerformance, setSearchPerformance] = useState(() => {
    const saved = localStorage.getItem('searchPerformance');
    return saved ? JSON.parse(saved) : {
      avgTime: 0,
      minTime: 0,
      maxTime: 0,
      searches: []
    };
  });

  // Save total searches to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('totalSearches', totalSearches.toString());
  }, [totalSearches]);

  // Save total matches to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('totalMatches', totalMatches.toString());
  }, [totalMatches]);
  
  // Save search performance to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('searchPerformance', JSON.stringify(searchPerformance));
  }, [searchPerformance]);
  
  // Record a new search performance metric
  const recordSearchPerformance = (executionTime, resultCount) => {
    setSearchPerformance(prev => {
      const searches = [...prev.searches, { 
        executionTime, 
        resultCount, 
        timestamp: new Date().toISOString() 
      }].slice(-50); // Keep last 50 searches
      
      // Calculate new average
      const avgTime = searches.length > 0 
        ? searches.reduce((sum, s) => sum + s.executionTime, 0) / searches.length 
        : 0;
      
      // Find min and max times
      const times = searches.map(s => s.executionTime);
      const minTime = searches.length > 0 ? Math.min(...times) : 0;
      const maxTime = searches.length > 0 ? Math.max(...times) : 0;
      
      return {
        avgTime,
        minTime,
        maxTime,
        searches
      };
    });
  };
  
  // Reset all search stats
  const resetSearchStats = () => {
    setTotalSearches(0);
    setTotalMatches(0);
    setSearchResults([]);
    setSearchPerformance({
      avgTime: 0,
      minTime: 0,
      maxTime: 0,
      searches: []
    });
  };

  return (
    <SearchContext.Provider value={{
      totalSearches,
      setTotalSearches,
      totalMatches,
      setTotalMatches,
      searchResults,
      setSearchResults,
      searchPerformance,
      recordSearchPerformance,
      resetSearchStats
    }}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook to use the search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export default SearchContext;