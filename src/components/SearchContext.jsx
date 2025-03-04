import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [totalSearches, setTotalSearches] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]); // Store analytics data
  
  return (
    <SearchContext.Provider value={{
      totalSearches,
      setTotalSearches,
      totalMatches,
      setTotalMatches,
      searchResults,
      setSearchResults,
      analyticsData,
      setAnalyticsData
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
