import React from 'react';
import '../styles/Base.css';
import '../styles/components/Card.css';
import '../styles/components/Form.css';
import '../styles/components/Button.css';
import '../styles/components/StatusBadge.css';
import '../styles/components/Animation.css';
import '../styles/layouts/AuditLog.css';

function AuditLog() {
  return (
    <div className="audit-log-container fade-in">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Audit Log</h2>
        <p className="text-gray-600">Track all system activities and user actions.</p>
      </div>
      
      {/* Search and filter section */}
      <div className="card mb-4 slide-up">
        <div className="card-body">
          <div className="flex flex-wrap items-center justify-between">
            <div className="search-form-wrapper mb-3 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search audit logs..."
                className="search-bar"
              />
            </div>
            <div className="flex space-x-2">
              <button className="btn btn-secondary">
                <i className="bi bi-funnel mr-2"></i> Filter
              </button>
              <button className="btn btn-secondary">
                <i className="bi bi-download mr-2"></i> Export
              </button>
            </div>
          </div>

          {/* Filter options */}
          <div className="filter-options mt-3 p-3 bg-light rounded border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-medium mb-1 block">Date Range</label>
                <select className="form-control">
                  <option>Last 24 hours</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Custom range</option>
                </select>
              </div>
              <div>
                <label className="font-medium mb-1 block">Action Type</label>
                <select className="form-control">
                  <option>All actions</option>
                  <option>Database Update</option>
                  <option>Batch Screening</option>
                  <option>Configuration Change</option>
                  <option>User Login</option>
                </select>
              </div>
              <div>
                <label className="font-medium mb-1 block">User</label>
                <select className="form-control">
                  <option>All users</option>
                  <option>system_admin</option>
                  <option>jane_doe</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audit log entries */}
      <div className="audit-logs-section slide-up" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-xl font-semibold mb-3">Recent Activity</h3>
        
        {/* Log entry 1 */}
        <div className="card audit-log-entry mb-3">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div className="audit-log-icon">
                <div className="icon-circle database-update">
                  <i className="bi bi-database-check"></i>
                </div>
              </div>
              <div className="audit-log-content flex-grow">
                <h5 className="font-semibold mb-1">Database Update</h5>
                <p className="mb-1">Sanctions list updated with 150 new entries</p>
                <div className="audit-log-meta">
                  <span className="audit-meta-item">
                    <i className="bi bi-person mr-1"></i> system_admin
                  </span>
                  <span className="audit-meta-item">
                    <i className="bi bi-globe mr-1"></i> 192.168.1.100
                  </span>
                </div>
              </div>
              <div className="audit-log-time">
                <span className="status-badge info">2 mins ago</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Log entry 2 */}
        <div className="card audit-log-entry mb-3">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div className="audit-log-icon">
                <div className="icon-circle batch-screening">
                  <i className="bi bi-files"></i>
                </div>
              </div>
              <div className="audit-log-content flex-grow">
                <h5 className="font-semibold mb-1">Batch Screening</h5>
                <p className="mb-1">Processed 1,234 records with 3 matches</p>
                <div className="audit-log-meta">
                  <span className="audit-meta-item">
                    <i className="bi bi-person mr-1"></i> jane_doe
                  </span>
                  <span className="audit-meta-item">
                    <i className="bi bi-globe mr-1"></i> 192.168.1.105
                  </span>
                </div>
              </div>
              <div className="audit-log-time">
                <span className="status-badge info">1 hour ago</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Log entry 3 */}
        <div className="card audit-log-entry mb-3">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div className="audit-log-icon">
                <div className="icon-circle config-change">
                  <i className="bi bi-gear"></i>
                </div>
              </div>
              <div className="audit-log-content flex-grow">
                <h5 className="font-semibold mb-1">Configuration Change</h5>
                <p className="mb-1">Modified matching algorithm settings</p>
                <div className="audit-log-meta">
                  <span className="audit-meta-item">
                    <i className="bi bi-person mr-1"></i> system_admin
                  </span>
                  <span className="audit-meta-item">
                    <i className="bi bi-globe mr-1"></i> 192.168.1.100
                  </span>
                </div>
              </div>
              <div className="audit-log-time">
                <span className="status-badge info">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Log entry 4 - New entry */}
        <div className="card audit-log-entry mb-3">
          <div className="card-body">
            <div className="flex justify-between items-start">
              <div className="audit-log-icon">
                <div className="icon-circle user-login">
                  <i className="bi bi-box-arrow-in-right"></i>
                </div>
              </div>
              <div className="audit-log-content flex-grow">
                <h5 className="font-semibold mb-1">User Login</h5>
                <p className="mb-1">Successful authentication</p>
                <div className="audit-log-meta">
                  <span className="audit-meta-item">
                    <i className="bi bi-person mr-1"></i> jane_doe
                  </span>
                  <span className="audit-meta-item">
                    <i className="bi bi-globe mr-1"></i> 192.168.1.105
                  </span>
                </div>
              </div>
              <div className="audit-log-time">
                <span className="status-badge info">4 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination controls */}
      <div className="card mt-4 slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="card-body">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Showing 10 of 1,234 entries</span>
            <div className="pagination-controls">
              <button className="btn btn-secondary btn-sm mr-2">
                <i className="bi bi-chevron-left mr-1"></i> Previous
              </button>
              <button className="btn btn-primary btn-sm">
                Next <i className="bi bi-chevron-right ml-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditLog;