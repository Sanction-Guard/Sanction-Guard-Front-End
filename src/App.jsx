import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './AuthContext.jsx'; // Import the context
import ModernNavigation from './components/ModernNavigation.jsx';
import Login from './components/Login.jsx';
import ReportsAnalytics from './components/ReportsAnalytics.jsx';
import DataImport from './components/DataImport.jsx';
import SearchScreen from './components/SearchScreen.jsx';
import BatchProcessing from './components/BatchProcessing.jsx';
import AuditLog from './components/AuditLog.jsx';
import { SearchProvider } from './components/SearchContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router>
          <AuthContext.Consumer>
            {({ isAuthenticated, userRole }) => (
              <div className="app-container">
                {isAuthenticated && <ModernNavigation />}
                <main className="main-content">
                  <Routes>
                    <Route
                      path="/login"
                      element={isAuthenticated ? <Navigate to="/" /> : <Login />}
                    />
                    <Route
                      path="/"
                      element={isAuthenticated ? <ReportsAnalytics /> : <Navigate to="/login" />}
                    />
                    <Route
                      path="/data-import"
                      element={
                        isAuthenticated && (userRole === 'manager' || userRole === 'admin') ? (
                          <DataImport />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    />
                    <Route
                      path="/search-screen"
                      element={isAuthenticated ? <SearchScreen /> : <Navigate to="/login" />}
                    />
                    <Route
                      path="/batch-processing"
                      element={
                        isAuthenticated && (userRole === 'manager' || userRole === 'admin') ? (
                          <BatchProcessing />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    />
                    <Route
                      path="/reports-analytics"
                      element={isAuthenticated ? <ReportsAnalytics /> : <Navigate to="/login" />}
                    />
                    <Route
                      path="/audit-log"
                      element={
                        isAuthenticated && userRole === 'admin' ? (
                          <AuditLog />
                        ) : (
                          <Navigate to="/" />
                        )
                      }
                    />
                  </Routes>
                </main>
              </div>
            )}
          </AuthContext.Consumer>
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;