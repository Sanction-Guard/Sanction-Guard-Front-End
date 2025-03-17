import React, { useState, useEffect } from 'react';
import '../styles/Base.css';
import '../styles/layouts/SearchScreen.css';
import '../styles/components/Card.css';
import '../styles/components/Button.css';
import '../styles/components/Form.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';

const ModernSearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Sample search results
  const mockResults = [
    { id: 1, name: 'Data Record #45678', category: 'Customer', date: '2023-05-12', status: 'Active' },
    { id: 2, name: 'Data Record #45679', category: 'Order', date: '2023-05-10', status: 'Processing' },
    { id: 3, name: 'Data Record #45680', category: 'Inventory', date: '2023-05-09', status: 'Inactive' },
    { id: 4, name: 'Data Record #45681', category: 'Customer', date: '2023-05-08', status: 'Active' },
    { id: 5, name: 'Data Record #45682', category: 'Order', date: '2023-05-07', status: 'Completed' },
    { id: 6, name: 'Data Record #45683', category: 'Inventory', date: '2023-05-06', status: 'Active' },
    { id: 7, name: 'Data Record #45684', category: 'Customer', date: '2023-05-05', status: 'Inactive' },
  ];
  
  // Filter options
  const filterOptions = [
    { id: 'category', name: 'Category', options: ['Customer', 'Order', 'Inventory'] },
    { id: 'status', name: 'Status', options: ['Active', 'Inactive', 'Processing', 'Completed'] },
    { id: 'date', name: 'Date', options: ['Last 7 days', 'Last 30 days', 'Last 90 days'] }
  ];
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setSearchResults(mockResults.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
      ));
      setIsSearching(false);
    }, 800);
  };
  
  // Toggle filter selection
  const toggleFilter = (filterId, value) => {
    const filterKey = `${filterId}:${value}`;
    if (selectedFilters.includes(filterKey)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filterKey));
    } else {
      setSelectedFilters([...selectedFilters, filterKey]);
    }
  };
  
  // Apply filters to results
  useEffect(() => {
    if (searchResults.length === 0 || selectedFilters.length === 0) return;
    
    const filtered = mockResults.filter(item => {
      return selectedFilters.every(filter => {
        const [type, value] = filter.split(':');
        if (type === 'category') return item.category === value;
        if (type === 'status') return item.status === value;
        if (type === 'date' && value === 'Last 7 days') {
          // Just a mock implementation for demonstration
          return true;
        }
        return true;
      });
    });
    
    setSearchResults(filtered);
  }, [selectedFilters]);
  
  return (
    <div className="search-container fade-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Search Records</h1>
        <p className="text-gray-600">Find and manage data records across your system.</p>
      </div>
      
      {/* Search Form */}
      <div className="card mb-6">
        <div className="p-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-grow">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="text"
                className="search-bar w-full pl-10"
                placeholder="Search by record ID, category, status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary ml-3" disabled={isSearching}>
              {isSearching ? (
                <span className="flex items-center">
                  <div className="loading-spinner mr-2"></div>
                  Searching...
                </span>
              ) : 'Search'}
            </button>
            <button 
              type="button" 
              className={`btn ml-3 ${showFilters ? 'btn-accent' : 'btn-secondary'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filters {selectedFilters.length > 0 && `(${selectedFilters.length})`}
            </button>
          </form>
          
          {/* Filters section with animation */}
          {showFilters && (
            <div className="mt-4 p-4 border-t border-light-gray slide-up">
              <h3 className="font-medium mb-3">Filter Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filterOptions.map((filter) => (
                  <div key={filter.id} className="filter-group">
                    <h4 className="text-sm font-medium mb-2">{filter.name}</h4>
                    <div className="flex flex-wrap gap-2">
                      {filter.options.map((option) => {
                        const isActive = selectedFilters.includes(`${filter.id}:${option}`);
                        return (
                          <button
                            key={option}
                            type="button"
                            className={`px-3 py-1 rounded-full text-sm border transition-all ${
                              isActive 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:text-primary'
                            }`}
                            onClick={() => toggleFilter(filter.id, option)}
                          >
                            {option}
                            {isActive && (
                              <span className="ml-1">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedFilters.length > 0 && (
                <div className="mt-3 flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Active filters:</span>
                  {selectedFilters.map(filter => {
                    const [type, value] = filter.split(':');
                    return (
                      <span 
                        key={filter} 
                        className="bg-light-gray text-gray-700 text-xs rounded-full px-2 py-1 mr-2 flex items-center"
                      >
                        {value}
                        <button 
                          className="ml-1 text-gray-500 hover:text-gray-700"
                          onClick={() => toggleFilter(type, value)}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                  <button 
                    className="text-sm text-primary hover:underline"
                    onClick={() => setSelectedFilters([])}
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Search Results */}
      {searchResults.length > 0 ? (
        <div className="card">
          <div className="p-4 border-b border-light-gray flex justify-between items-center">
            <h3 className="font-medium">Results ({searchResults.length})</h3>
            <div className="flex items-center">
              <button className="btn btn-sm mr-2">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export
              </button>
              <div className="relative">
                <select className="form-control appearance-none pr-8">
                  <option>Sort by: Newest</option>
                  <option>Sort by: Oldest</option>
                  <option>Sort by: Name A-Z</option>
                  <option>Sort by: Name Z-A</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-light">
                  <th className="text-left py-3 px-4 font-medium">Record Name</th>
                  <th className="text-left py-3 px-4 font-medium">Category</th>
                  <th className="text-left py-3 px-4 font-medium">Date</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((result, index) => (
                  <tr 
                    key={result.id} 
                    className="border-b border-light-gray hover:bg-light transition-colors"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <td className="py-3 px-4">{result.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs
                        ${result.category === 'Customer' ? 'bg-blue-100 text-blue-800' : ''}
                        ${result.category === 'Order' ? 'bg-purple-100 text-purple-800' : ''}
                        ${result.category === 'Inventory' ? 'bg-green-100 text-green-800' : ''}
                      `}>
                        {result.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">{result.date}</td>
                    <td className="py-3 px-4">
                      <span className={`status-badge 
                        ${result.status === 'Active' ? 'healthy' : ''}
                        ${result.status === 'Inactive' ? 'danger' : ''}
                        ${result.status === 'Processing' ? 'warning' : ''}
                        ${result.status === 'Completed' ? 'info' : ''}
                      `}>
                        {result.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="p-1 text-blue-600 hover:text-blue-800 transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button className="p-1 text-red-600 hover:text-red-800 transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                        <button className="p-1 text-gray-600 hover:text-gray-800 transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 flex justify-between items-center border-t border-light-gray">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{searchResults.length}</span> of <span className="font-medium">{mockResults.length}</span> results
            </div>
            <div className="flex space-x-1">
              <button className="btn btn-sm btn-secondary" disabled>Previous</button>
              <button className="btn btn-sm btn-primary">Next</button>
            </div>
          </div>
        </div>
      ) : searchTerm && !isSearching ? (
        <div className="card p-8 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium mb-1">No results found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
          <button className="btn btn-primary" onClick={() => {setSearchTerm(''); setSelectedFilters([])}}>
            Clear Search
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default ModernSearchScreen;