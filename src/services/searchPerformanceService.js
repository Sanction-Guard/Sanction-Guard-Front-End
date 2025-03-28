// src/services/searchPerformanceService.js
import axios from 'axios';
import { recordSearchTiming } from './dashboardService';

// Wrapper for the search API that tracks performance
export const performSearch = async (searchTerm, searchType = 'individual') => {
  // Record start time
  const startTime = performance.now();
  
  try {
    // Make the actual API call
    const response = await axios.post('http://54.197.3.150:3001/api/search/search', {
      searchTerm,
      searchType
    });
    
    // Calculate execution time
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    
    // Record the timing
    recordSearchTiming(executionTime);
    
    // Store the last search info
    const searchInfo = {
      term: searchTerm,
      type: searchType,
      timestamp: new Date().toISOString(),
      executionTime,
      resultCount: response.data.length || 0
    };
    
    localStorage.setItem('lastSearchInfo', JSON.stringify(searchInfo));
    
    // Update search history
    updateSearchHistory(searchInfo);
    
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// Track search history
const updateSearchHistory = (searchInfo) => {
  try {
    const storedHistory = localStorage.getItem('searchHistory');
    let history = storedHistory ? JSON.parse(storedHistory) : [];
    
    // Add new search and keep most recent 20
    history.unshift(searchInfo);
    history = history.slice(0, 20);
    
    localStorage.setItem('searchHistory', JSON.stringify(history));
  } catch (error) {
    console.error('Error updating search history:', error);
  }
};

// Get search history
export const getSearchHistory = () => {
  try {
    const storedHistory = localStorage.getItem('searchHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (error) {
    console.error('Error getting search history:', error);
    return [];
  }
};

// Get search performance metrics
export const getSearchPerformanceMetrics = () => {
  try {
    const searchTimings = JSON.parse(localStorage.getItem('searchTimings') || '[]');
    const searchHistory = getSearchHistory();
    
    const avgTime = searchTimings.length > 0 
      ? searchTimings.reduce((sum, time) => sum + time, 0) / searchTimings.length 
      : 0;
      
    const totalSearches = searchHistory.length;
    const successfulSearches = searchHistory.filter(s => s.resultCount > 0).length;
    
    return {
      averageTime: avgTime,
      totalSearches,
      successfulSearches,
      successRate: totalSearches > 0 ? (successfulSearches / totalSearches) * 100 : 0
    };
  } catch (error) {
    console.error('Error calculating search performance metrics:', error);
    return {
      averageTime: 0,
      totalSearches: 0,
      successfulSearches: 0,
      successRate: 0
    };
  }
};

export default {
  performSearch,
  getSearchHistory,
  getSearchPerformanceMetrics
};