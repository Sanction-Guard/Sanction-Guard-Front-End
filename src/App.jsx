import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'recharts'; // Import recharts
import './styles/RechartsOverride.css'; // Import overrides immediately after
import ModernNavigation from './components/ModernNavigation.jsx';
import Dashboard from './components/Dashboard.jsx';
import SearchScreen from './components/SearchScreen.jsx';
import { SearchProvider } from "./components/SearchContext.jsx"; // Ensure this import is correct
import BatchProcessing from './components/BatchProcessing.jsx';
import DataImport from './components/DataImport.jsx';
import ReportsAnalytics from './components/ReportsAnalytics.jsx';
import AuditLog from './components/AuditLog.jsx';
import DatabaseStatus from './components/DatabaseStatus.jsx';
import Settings from './components/Settings.jsx'; // Your Settings component
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <SearchProvider>
      <Router>
        <div className="app-container">
          {/* Old Nav Bar */}
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
            <Route path="/settings" element={<Settings />} /> {/* Added Settings route */}
          </Routes>
          </main>
        </div>
      </Router>
    </SearchProvider>
  );
}

export default App;