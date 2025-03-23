import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import 'recharts'; // Import recharts
import './styles/RechartsOverride.css'; // Import overrides immediately after
import ModernNavigation from './components/ModernNavigation.jsx';
import Dashboard from './components/Dashboard.jsx';
import SearchScreen from './components/SearchScreen.jsx';
import { SearchProvider } from './components/SearchContext.jsx'; // Single import for SearchProvider
import BatchProcessing from './components/BatchProcessing.jsx';
import DataImport from './components/DataImport.jsx';
import ReportsAnalytics from './components/ReportsAnalytics.jsx';
import AuditLog from './components/AuditLog.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alerts from './components/Alerts.jsx'; // Single import for Alerts

function App() {
  return (
    <SearchProvider>
      <Router>
        <div className="app-container">
          {/* Modern Navigation Bar */}
          <ModernNavigation />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/data-import" element={<DataImport />} />
              <Route path="/search-screen" element={<SearchScreen />} />
              <Route path="/batch-processing" element={<BatchProcessing />} />
              <Route path="/reports-analytics" element={<ReportsAnalytics />} />
              <Route path="/audit-log" element={<AuditLog />} />
              <Route path="/alerts" element={<Alerts />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SearchProvider>
  );
}

export default App;