import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ModernNavigation from './components/ModernNavigation.jsx';
import Dashboard from './components/Dashboard.jsx';
import SearchScreen from './components/SearchScreen.jsx';
import { SearchProvider } from "./components/SearchContext.jsx";
import BatchProcessing from './components/BatchProcessing.jsx';
import DataImport from './components/DataImport.jsx';
import ReportsAnalytics from './components/ReportsAnalytics.jsx';
import AuditLog from './components/AuditLog.jsx';
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
function App() {
  return (
    <SearchProvider>
      <Router>
        <div className="app-container">
          {/* Modern Navigation Bar */}
          <ModernNavigation />
          
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} /> {/* Redirect empty path to dashboard. So the dashboard is loaded as default */}
              <Route path="/dashboard" element={<Dashboard />} /> {/* Updated with new dashboard */}
              <Route path="/search-screen" element={<SearchScreen />} />
              <Route path="/batch-processing" element={<BatchProcessing />} />
              <Route path="/data-import" element={<DataImport />} />
              <Route path="/reports-analytics" element={<ReportsAnalytics />} />
              <Route path="/audit-log" element={<AuditLog />} />
              <Route path="/audit-log" element={<AuditLog />} />
              <Route path="/settings" element={<Settings />} /> {/* Added Settings route */}
          </Routes>
          </main>
        </div>
      </Router>
    </SearchProvider>
  );
}

export default App;