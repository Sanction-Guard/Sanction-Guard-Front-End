import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import DataImport from './components/DataImport.jsx';
import SearchScreen from './components/SearchScreen.jsx';
import BatchProcessing from './components/BatchProcessing.jsx';
import ReportsAnalytics from './components/ReportsAnalytics.jsx';
import AuditLog from './components/AuditLog.jsx';
import DatabaseStatus from './components/DatabaseStatus.jsx';
import Login from './components/Login.jsx'; // New Login component
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import { SearchProvider } from './components/SearchContext.jsx';
import ModernNavigation from './components/ModernNavigation.jsx';

function App() {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is logged in
  const userRole = localStorage.getItem('role'); // Get user role from localStorage

  return (
    <SearchProvider>
      <Router>
        <div className="app-container">
          {/* Conditionally render navigation based on authentication */}
          {isAuthenticated && <ModernNavigation />}
          
          <main className="main-content">
            <Routes>
              {/* Public Route: Login Page */}
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
              
              {/* Protected Routes */}
              <Route
                path="/"
                element={isAuthenticated ? <ReportsAnalytics /> : <Navigate to="/login" />}
              />
              <Route
                path="/data-import"
                element={isAuthenticated ? <DataImport /> : <Navigate to="/login" />}
              />
              <Route
                path="/search-screen"
                element={isAuthenticated ? <SearchScreen /> : <Navigate to="/login" />}
              />
              <Route
                path="/batch-processing"
                element={isAuthenticated && (userRole === 'manager' || userRole === 'admin') ? (
                  <BatchProcessing />
                ) : (
                  <Navigate to="/" />
                )}
              />
              <Route
                path="/reports-analytics"
                element={isAuthenticated ? <ReportsAnalytics /> : <Navigate to="/login" />}
              />
              <Route
                path="/audit-log"
                element={isAuthenticated && userRole === 'admin' ? (
                  <AuditLog />
                ) : (
                  <Navigate to="/" />
                )}
              />
            </Routes>
          </main>
        </div>
      </Router>
    </SearchProvider>
  );
}

export default App;