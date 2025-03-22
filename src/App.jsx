import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'recharts';
import './styles/RechartsOverride.css';
import ModernNavigation from './components/ModernNavigation.jsx';
import Dashboard from './components/Dashboard.jsx';
import SearchScreen from './components/SearchScreen.jsx';
import { SearchProvider } from './components/SearchContext.jsx';
import BatchProcessing from './components/BatchProcessing.jsx';
import DataImport from './components/DataImport.jsx';
import ReportsAnalytics from './components/ReportsAnalytics.jsx';
import AuditLog from './components/AuditLog.jsx';
import Login from './components/Login.jsx';
import { AuthProvider, useAuth } from './components/AuthContext'; // Import AuthProvider and useAuth
import 'bootstrap/dist/css/bootstrap.min.css';

// Protected route component using AuthContext
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Layout component
const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app-container">
      {!isLoginPage && <ModernNavigation />}
      <main className={isLoginPage ? 'full-content' : 'main-content'}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-screen"
            element={
              <ProtectedRoute>
                <SearchScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/batch-processing"
            element={
              <ProtectedRoute>
                <BatchProcessing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/data-import"
            element={
              <ProtectedRoute>
                <DataImport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports-analytics"
            element={
              <ProtectedRoute>
                <ReportsAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit-log"
            element={
              <ProtectedRoute>
                <AuditLog />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider> {/* Wrap the app with AuthProvider */}
      <SearchProvider>
        <Router>
          <AppLayout />
        </Router>
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;