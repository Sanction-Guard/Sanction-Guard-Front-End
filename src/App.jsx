import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModernNavigation from './components/ModernNavigation.jsx';
import Dashboard from './components/Dashboard.jsx';
import SearchScreen from './components/SearchScreen.jsx';
import { SearchProvider } from './components/SearchContext.jsx'; // Ensure this import is correct
import BatchProcessing from './components/BatchProcessing.jsx';
import DataImport from './components/DataImport.jsx';
import ReportsAnalytics from './components/ReportsAnalytics.jsx';
import AuditLog from './components/AuditLog.jsx';
import Login from './components/Login.jsx';
import { AuthProvider, useAuth } from './components/AuthContext'; // Import AuthProvider and useAuth
import Alerts from './components/Alerts.jsx';
import Settings from './components/Settings.jsx'; // Your Settings component
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/Base.css';
import './styles/components/Card.css';
import './styles/components/Button.css';
import './styles/components/Form.css';
import './styles/components/Animation.css';
import './styles/components/StatusBadge.css';
import './styles/layouts/SearchScreen.css';

/**
 * Main App Component
 * 
 * This component is the root of the application and sets up routing
 * and global context providers.
 * 
 * @returns {JSX.Element} The main application component
 */

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
          
        {/* <div className="app-container">
          Old Nav Bar
          <Navigation />
          <ModernNavigation />
          
          <main className="main-content">
            <Routes>
            <Route path="/" element={<Dashboard />} /> Redirect empty path to dashboard. So the dashboard is loaded as default
            <Route path="/dashboard" element={<Dashboard />} /> Updated with new dashboard
            <Route path="/search-screen" element={<SearchScreen />} />
            <Route path="/batch-processing" element={<BatchProcessing />} />
            <Route path="/data-import" element={<DataImport />} />
            <Route path="/reports-analytics" element={<ReportsAnalytics />} />
            <Route path="/audit-log" element={<AuditLog />} />
          </Routes>
          </main>
        </div> */}
      </Router> 
    </SearchProvider>
    </AuthProvider>
  );
}

export default App;