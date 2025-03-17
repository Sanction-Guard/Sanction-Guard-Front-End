import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchScreen from './components/UpdatedSearchScreen.jsx';
import BatchProcessing from './components/BatchProcessing.jsx';
import ReportsAnalytics from './components/ReportsAnalytics.jsx';
import AuditLog from './components/AuditLog.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import ModernNavigation from './components/ModernNavigation.jsx';
import Dashboard from './components/Dashboard.jsx';
import DataImport from './components/DataImport.jsx';


function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Older Navbar */}
        {/* <Navigation /> */}

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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;